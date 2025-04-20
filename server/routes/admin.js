const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get dashboard statistics
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM products');
    const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [totalRevenue] = await db.query('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');

    res.json({
      users: totalUsers[0].count,
      products: totalProducts[0].count,
      orders: totalOrders[0].count,
      revenue: totalRevenue[0].total || 0
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Product Management
// Add product
router.post('/products', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

    const result = await db.query(
      'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, imageUrl]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      stock,
      category,
      image_url: imageUrl
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Get all products with pagination and search
router.get('/products', auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const [products] = await db.query(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? LIMIT ? OFFSET ?',
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM products WHERE name LIKE ? OR description LIKE ?',
      [`%${search}%`, `%${search}%`]
    );

    res.json({
      products,
      total: total[0].count,
      page,
      totalPages: Math.ceil(total[0].count / limit)
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Order Management
// Get all orders with pagination, filtering and search
router.get('/orders', auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    const search = req.query.search || '';

    let query = `
      SELECT o.*, u.name as customer_name, u.email as customer_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    let params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [orders] = await db.query(query, params);

    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1' +
      (status ? ' AND o.status = ?' : '') +
      (search ? ' AND (u.name LIKE ? OR u.email LIKE ?)' : ''),
      params.slice(0, -2)
    );

    res.json({
      orders,
      total: total[0].count,
      page,
      totalPages: Math.ceil(total[0].count / limit)
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.patch('/orders/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// User Management
// Get all users with pagination and search
router.get('/users', auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE (name LIKE ? OR email LIKE ?) AND role = "user" LIMIT ? OFFSET ?',
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE (name LIKE ? OR email LIKE ?) AND role = "user"',
      [`%${search}%`, `%${search}%`]
    );

    res.json({
      users,
      total: total[0].count,
      page,
      totalPages: Math.ceil(total[0].count / limit)
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user details with order history
router.get('/users/:id', auth, admin, async (req, res) => {
  try {
    const userId = req.params.id;

    const [user] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      user: user[0],
      orders
    });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

module.exports = router;
