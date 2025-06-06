import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['order_status', 'product_restock', 'price_drop', 'general'],
    required: true 
  },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

// Add index for better query performance
notificationSchema.index({ user_id: 1, created_at: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);