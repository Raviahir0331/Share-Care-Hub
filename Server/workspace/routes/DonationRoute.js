const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../Model/DonationModel');
const { sendEmail } = require('../Model/EmailService');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Create a new product
router.post('/products', upload.single('donationImage'), async (req, res) => {
    try {
      const product = new Product({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        category: req.body.category,
        productName: req.body.productName,
        description: req.body.description,
        quality: req.body.quality,
        quantity: req.body.quantity || 1,
        donationImage: req.file ? req.file.path : null,
        terms: req.body.terms,
      });
  
      await product.save();
  
      // Send email to user
      const emailContent = `
        <h2>Product Details</h2>
        <p><strong>Full Name:</strong> ${product.fullName}</p>
        <p><strong>Email:</strong> ${product.email}</p>
        <p><strong>Phone:</strong> ${product.phone}</p>
        <p><strong>Address:</strong> ${product.address}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Product Name:</strong> ${product.productName}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <p><strong>Quality:</strong> ${product.quality}</p>
        <p><strong>Quantity:</strong> ${product.quantity}</p>
        ${product.donationImage ? `<img src="${product.donationImage}" alt="Product Image" style="max-width: 100px;" />` : ''}
      `;
  
      await sendEmail(product.email, 'Product Details', emailContent);
  
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  
// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product by ID
router.put('/products/:id', upload.single('donationImage'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.fullName = req.body.name || product.fullName;
    product.email = req.body.email || product.email;
    product.phone = req.body.phone || product.phone;
    product.address = req.body.address || product.address;
    product.category = req.body.category || product.category;
    product.productName = req.body.productName || product.productName;
    product.description = req.body.description || product.description;
    product.quality = req.body.quality || product.quality;
    product.quantity = req.body.quantity || product.quantity;
    product.donationImage = req.file ? req.file.path : product.donationImage;
    product.terms = req.body.terms || product.terms;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
