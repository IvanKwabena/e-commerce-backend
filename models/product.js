const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    // default: ' default'
  },
  richDescription: {
    type: String,
    default: ' ',
  },
  image: {
    type: String,
    default: ' ',
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  countInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// productSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// productSchema.set('toJSON', {
//   virtuals: true,
// });

module.exports = mongoose.model('Product', productSchema);
