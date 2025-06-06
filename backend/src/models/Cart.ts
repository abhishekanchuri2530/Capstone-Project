import mongoose from 'mongoose';

interface ICartItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  items: ICartItem[];
  created_at: Date;
  updated_at: Date;
}

const cartItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

cartSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);