const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['simple paint', 'wall art', 'glow in night', 'pest control'],
    default: 'simple paint',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 10,
  },
});

const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;
