// const jwt = require('jsonwebtoken');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No authentication token, access denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(401).json({ message: 'Token is invalid or expired' });
//   }
// };

// module.exports = auth;



// const express = require('express');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// // Authentication Middleware
// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No authentication token, access denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
//     if (!decoded.id) {
//       return res.status(401).json({ message: 'Invalid token, user ID missing' });
//     }

//     req.user = decoded;
//     console.log('Authenticated user:', req.user); // Debugging
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(401).json({ message: 'Token is invalid or expired' });
//   }
// };

// // Example Route to Test
// router.get('/test', (req, res) => {
//   res.send('Auth route is working!');
// });

// module.exports = router; // Export router ONLY






const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('No token provided in request');  // Debugging
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    console.log('Received Token:', token); // ✅ Debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (!decoded.id) {
      console.error('Decoded token missing user ID:', decoded); // Debugging
      return res.status(401).json({ message: 'Invalid token, user ID missing' });
    }

    req.user = decoded;
    console.log('Authenticated user:', req.user); // ✅ Debugging
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message); // Improved error logging
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = auth;

