const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API Endpoints
router.get('/productstotal', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: results[0].total });
  });
});

router.get('/orders', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM orders', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: results[0].total });
  });
});

router.get('/totalusers', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: results[0].total });
  });
});

router.get('/order-tracking', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM order_tracking', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: results[0].total });
  });
});

// Export router
module.exports = router;
