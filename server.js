const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./server/routes/auth');
const adminRoutes = require('./server/routes/admin');
const productRoutes = require('./server/routes/products');
const orderRoutes = require('./server/routes/orders');
const userRoutes = require('./server/routes/users');
const adminRoutes = require('.server/routes/adminRoutes'); // Adjust path if needed
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/users', userRoutes);

app.use('/api/orders', orderRoutes);    // for orders

app.use('/api', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Planto API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
