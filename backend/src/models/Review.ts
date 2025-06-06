import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

reviewSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Add index for better query performance
reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);