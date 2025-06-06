import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Order, OrderStatus } from '../models/Order';
import { Cart, ICart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { OrderItem } from '../models/OrderItem';
import { Review } from '../models/Review';
import { Notification } from '../models/Notification';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await User.findById(context.user.id);
    },
    product: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id).populate('category_id');
    },
    products: async (_: any, { category, search, limit }: { category?: string, search?: string, limit?: number }) => {
      let query: any = {};
      if (category) query.category_id = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      let cursor = Product.find(query).populate('category_id');
      if (limit) cursor = cursor.limit(limit);
      return await cursor;
    },
    categories: async () => {
      return await Category.find();
    },
    cart: async (_: any, __: any, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      const cart = await Cart.findOne({ user_id: context.user.id })
        .populate('items.product_id');
      return cart;
    },
    order: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await Order.findOne({ _id: id, user_id: context.user.id })
        .populate('items.product');
    },
    orders: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await Order.find({ user_id: context.user.id })
        .populate('items.product');
    },
    productReviews: async (_: any, { productId }: { productId: string }) => {
      return await Review.find({ product_id: productId })
        .populate('user_id')
        .populate('product_id')
        .sort({ created_at: -1 });
    },
    userReviews: async (_: any, { userId }: { userId: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      // Users can only view their own reviews unless they're an admin
      if (context.user.id !== userId) throw new GraphQLError('Not authorized');
      return await Review.find({ user_id: userId })
        .populate('product_id')
        .sort({ created_at: -1 });
    },
    notifications: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await Notification.find({ user_id: context.user.id })
        .sort({ created_at: -1 });
    }
  },

  Mutation: {
    register: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new GraphQLError('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password_hash: hashedPassword
      });

      const token = generateToken(user);
      return { token, user };
    },

    login: async (_: any, { email, password }: { email: string, password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('User not found');
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw new GraphQLError('Invalid password');
      }

      const token = generateToken(user);
      return { token, user };
    },

    addToCart: async (_: any, { productId, quantity }: { productId: string, quantity: number }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      let cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart) {
        cart = await Cart.create({ 
          user_id: context.user.id,
          items: []
        });
      }

      const existingItem = cart.items.find(item => 
        item.product_id.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ 
          product_id: new mongoose.Types.ObjectId(productId), 
          quantity 
        });
      }

      await cart.save();
      return await Cart.findById(cart._id).populate('items.product_id');
    },

    updateCartItem: async (_: any, { productId, quantity }: { productId: string, quantity: number }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      const cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart) throw new GraphQLError('Cart not found');

      const itemIndex = cart.items.findIndex(item => 
        item.product_id.toString() === productId
      );

      if (itemIndex === -1) throw new GraphQLError('Item not found in cart');

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      await cart.save();
      return await Cart.findById(cart._id).populate('items.product_id');
    },

    removeFromCart: async (_: any, { productId }: { productId: string }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      const cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart) throw new GraphQLError('Cart not found');

      cart.items = cart.items.filter(item => 
        item.product_id.toString() !== productId
      );

      await cart.save();
      return await Cart.findById(cart._id).populate('items.product_id');
    },

    createOrder: async (_: any, { address }: { address: any }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      const cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart || cart.items.length === 0) throw new GraphQLError('Cart is empty');

      const productIds = cart.items.map(item => item.product_id);
      const products = await Product.find({ _id: { $in: productIds } });

      const orderItems = cart.items.map(item => {
        const product = products.find(p => p._id.toString() === item.product_id.toString());
        if (!product) throw new GraphQLError('Product not found');
        if (product.stock < item.quantity) throw new GraphQLError(`Insufficient stock for ${product.name}`);
        
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_time: product.price
        };
      });

      const total = orderItems.reduce((sum: number, item) => {
        const product = products.find(p => p._id.toString() === item.product_id.toString());
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      const order = await Order.create({
        user_id: context.user.id,
        items: orderItems,
        total,
        shipping_address: address,
        status: OrderStatus.PENDING
      });

      // Update product stock
      await Promise.all(orderItems.map(item => {
        return Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: -item.quantity } }
        );
      }));

      // Clear the cart
      cart.items = [];
      await cart.save();

      return await Order.findById(order._id).populate('items.product_id');
    },

    updateOrderStatus: async (_: any, { orderId, status }: { orderId: string, status: OrderStatus }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const order = await Order.findById(orderId);
      if (!order) throw new GraphQLError('Order not found');
      
      if (order.user_id.toString() !== context.user.id) {
        throw new GraphQLError('Not authorized');
      }

      order.status = status;
      await order.save();
      return await Order.findById(order._id).populate('items.product_id');
    },

    createReview: async (_: any, { productId, rating, comment }: { productId: string, rating: number, comment: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({ 
        product_id: productId, 
        user_id: context.user.id 
      });
      
      if (existingReview) {
        throw new GraphQLError('You have already reviewed this product');
      }

      // Verify that the user has purchased the product
      const orders = await Order.find({ 
        user_id: context.user.id,
        'items.product_id': productId,
        status: 'delivered'
      });

      if (orders.length === 0) {
        throw new GraphQLError('You can only review products you have purchased');
      }

      const review = await Review.create({
        product_id: productId,
        user_id: context.user.id,
        rating,
        comment
      });

      return await Review.findById(review._id)
        .populate('user_id')
        .populate('product_id');
    },

    updateReview: async (_: any, { reviewId, rating, comment }: { reviewId: string, rating: number, comment: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const review = await Review.findById(reviewId);
      if (!review) throw new GraphQLError('Review not found');
      
      if (review.user_id.toString() !== context.user.id) {
        throw new GraphQLError('Not authorized');
      }

      review.rating = rating;
      review.comment = comment;
      await review.save();

      return await Review.findById(review._id)
        .populate('user_id')
        .populate('product_id');
    },

    deleteReview: async (_: any, { reviewId }: { reviewId: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const review = await Review.findById(reviewId);
      if (!review) throw new GraphQLError('Review not found');
      
      if (review.user_id.toString() !== context.user.id) {
        throw new GraphQLError('Not authorized');
      }

      await review.deleteOne();
      return true;
    },

    markNotificationRead: async (_: any, { notificationId }: { notificationId: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user_id: context.user.id },
        { is_read: true },
        { new: true }
      );

      if (!notification) throw new GraphQLError('Notification not found');
      return notification;
    },

    markAllNotificationsRead: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      await Notification.updateMany(
        { user_id: context.user.id, is_read: false },
        { is_read: true }
      );

      return await Notification.find({ user_id: context.user.id })
        .sort({ created_at: -1 });
    }
  },

  User: {
    orders: async (parent: any) => {
      return await Order.find({ user_id: parent._id }).populate('items.product');
    },
    cart: async (parent: any) => {
      return await Cart.findOne({ user_id: parent._id }).populate('items.product');
    },
    reviews: async (parent: any) => {
      return await Review.find({ user_id: parent._id })
        .populate('product_id');
    },
    notifications: async (parent: any) => {
      return await Notification.find({ user_id: parent._id })
        .sort({ created_at: -1 });
    }
  },

  Category: {
    products: async (parent: any) => {
      return await Product.find({ category_id: parent._id });
    }
  },

  Product: {
    category: async (parent: any) => {
      return await Category.findById(parent.category_id);
    },
    reviews: async (parent: any) => {
      return await Review.find({ product_id: parent._id })
        .populate('user_id');
    },
    averageRating: async (parent: any) => {
      const reviews = await Review.find({ product_id: parent._id });
      if (reviews.length === 0) return null;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    }
  },

  Review: {
    user: async (parent: any) => {
      return await User.findById(parent.user_id);
    },
    product: async (parent: any) => {
      return await Product.findById(parent.product_id);
    }
  },

  Notification: {
    user: async (parent: any) => {
      return await User.findById(parent.user_id);
    }
  }
};