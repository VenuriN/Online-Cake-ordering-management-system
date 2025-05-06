import mongoose from 'mongoose';

const cakeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  additionalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const CakeCategory = mongoose.model('CakeCategory', cakeCategorySchema);

export default CakeCategory;
