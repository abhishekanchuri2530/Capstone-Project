import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

cartItemSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const CartItem = mongoose.model('CartItem', cartItemSchema);