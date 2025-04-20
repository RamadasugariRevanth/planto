const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const initDatabase = require('./config/database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
require('dotenv').config();

const app = express();

// Initialize database
initDatabase().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public/static')));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    req.db = {
      getConnection: async () => {
        return connection;
      }
    };
    
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
});  