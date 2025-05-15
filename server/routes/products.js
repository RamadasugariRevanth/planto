const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const path = require('path');
const { query } = require('../config/db'); // Adjust path based on your project structure

const multer = require('multer');

// Ensure that the 'uploads' folder is served statically
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure storage and filename for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    const name = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'); // Remove problematic characters
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + name); // Ensure unique filenames
  }
});

const upload = multer({ storage });

// Helper function to validate and format image URL
const formatImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/300?text=No+Image'; // Placeholder if no image is available
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If it's a local path, ensure it starts with /uploads
  if (!imageUrl.startsWith('/uploads')) {
    return path.join('/uploads', imageUrl); // Serving static files from 'uploads'
  }

  return imageUrl;
};

// Get all products with filters and sorting
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, search } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Apply filters only if present
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        sql += ' ORDER BY price ASC';
        break;
      case 'price_high':
        sql += ' ORDER BY price DESC';
        break;
      case 'newest':
        sql += ' ORDER BY created_at DESC';
        break;
      case 'popular':
        sql += ' ORDER BY sales_count DESC';
        break;
      default:
        sql += ' ORDER BY created_at DESC';
    }

    const products = await query(sql, params);

    // Format image URLs for all products
    products.forEach(product => {
      product.image_url = formatImageUrl(product.image_url);
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    product.image_url = formatImageUrl(product.image_url); // Format image URL for a single product

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create new product (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { name, description, price, stock, category } = req.body;
    const imageFile = req.file;

    // Validation
    if (!name?.trim() || !description?.trim() || isNaN(price) || isNaN(stock) || !category?.trim()) {
      return res.status(400).json({ message: 'All fields are required except image' });
    }

    const imageUrl = imageFile ? imageFile.filename : null; // Use multer's saved filename

    const [result] = await query(
      'INSERT INTO products (name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, imageUrl, category]
    );

    res.status(201).json({
      message: 'Product created successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { name, description, price, stock, image_url, category } = req.body;
    const formattedImageUrl = formatImageUrl(image_url);

    const [result] = await query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category = ? WHERE id = ?',
      [name, description, price, stock, formattedImageUrl, category, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [result] = await query('DELETE FROM products WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
