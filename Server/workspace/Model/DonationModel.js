const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true }, // New field for product category
  productName: { type: String, required: true }, // New field for product name
  description: { type: String, required: true }, // New field for product description
  quality: { type: String, enum: ['normal', 'medium', 'high'], required: true }, // New field for product quality
  quantity: { type: Number, default: 1 }, // New field with default value 1
  donationImage: { type: String }, // File path to the uploaded image
  terms: { type: Boolean, required: true },
}, { timestamps: true }); // This automatically adds `createdAt` and `updatedAt` fields

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
