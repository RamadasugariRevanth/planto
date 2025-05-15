const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user profile including shipping details
router.get('/profile', auth, async (req, res) => {
  const connection = await req.db.getConnection();
  try {
    const [users] = await connection.execute(
      'SELECT id, email, fullName, phone, shipping_details FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    let shippingDetails = {};
    
    if (user.shipping_details) {
      try {
        shippingDetails = JSON.parse(user.shipping_details);
      } catch (e) {
        console.error('Error parsing shipping details:', e);
      }
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      shippingDetails
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  } finally {
    connection.release();
  }
});


router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*) AS total FROM users WHERE active = 1');
    res.json({ total: result[0].total });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// Update user profile and shipping details
router.put('/profile', auth, async (req, res) => {
  const connection = await req.db.getConnection();
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const { shippingDetails } = req.body;
    
    await connection.execute(
      'UPDATE users SET shipping_details = ? WHERE id = ?',
      [JSON.stringify(shippingDetails), req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  } finally {
    await connection.end(); // ✅ Use `end()` instead of `release()`
  }
});


// Get shipping details
router.get('/shipping-details', auth, async (req, res) => {
  const connection = await req.db.getConnection();
  try {
    const [users] = await connection.execute(
      'SELECT shipping_details FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let shippingDetails = {};
    if (users[0].shipping_details) {
      try {
        shippingDetails = JSON.parse(users[0].shipping_details);
      } catch (e) {
        console.error('Error parsing shipping details:', e);
      }
    }

    res.json(shippingDetails);
  } catch (error) {
    console.error('Error fetching shipping details:', error);
    res.status(500).json({ message: 'Error fetching shipping details' });
  } finally {
    connection.release();
  }
});

module.exports = router;
