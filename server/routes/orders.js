const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Place a new order
router.post('/', auth, async (req, res) => {
  const connection = await req.db.getConnection();
  try {
    await connection.beginTransaction();

    const { items, shippingDetails } = req.body;
    const userId = req.user.id;

    // Validate that all products exist and have sufficient stock
    for (const item of items) {
      const [products] = await connection.execute(
        'SELECT id, stock FROM products WHERE id = ?',
        [item.id]
      );

      if (products.length === 0) {
        throw new Error(`Product with ID ${item.id} not found`);
      }

      const product = products[0];
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.id}`);
      }
    }

    // Calculate total amount
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)',
      [userId, total, JSON.stringify(shippingDetails), 'pending']
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    // Create initial tracking entry
    await connection.execute(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, 'Order Placed', 'Your order has been successfully placed']
    );

    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      status: 'pending'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  } finally {
    connection.release();
  }
});


// // Get user's orders
// router.get('/my-orders', auth, async (req, res) => {
//   const connection = await req.db.getConnection();
//   try {
//     const [orders] = await connection.execute(
//       `SELECT o.*, 
//         GROUP_CONCAT(DISTINCT ot.status) as tracking_status,
//         GROUP_CONCAT(DISTINCT ot.description) as tracking_description,
//         GROUP_CONCAT(DISTINCT ot.created_at) as tracking_dates
//       FROM orders o
//       LEFT JOIN order_tracking ot ON o.id = ot.order_id
//       WHERE o.user_id = ?
//       GROUP BY o.id
//       ORDER BY o.created_at DESC`,
//       [req.user.id]
//     );

//     // Get order items for each order
//     for (let order of orders) {
//       const [items] = await connection.execute(
//         `SELECT oi.*, p.name, p.image_url as image
//         FROM order_items oi
//         JOIN products p ON oi.product_id = p.id
//         WHERE oi.order_id = ?`,
//         [order.id]
//       );
//       order.items = items;
      
//       // Parse tracking information
//       if (order.tracking_status) {
//         order.tracking = {
//           status: order.tracking_status.split(','),
//           description: order.tracking_description.split(','),
//           dates: order.tracking_dates.split(',')
//         };
//       }
      
//       // Parse shipping address
//       order.shipping_address = JSON.parse(order.shipping_address);
//     }

//     res.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ message: 'Error fetching orders', error: error.message });
//   } finally {
//     connection.release();
//   }
// });





// Get user's orders
// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  const connection = await req.db.getConnection();
  try {
    console.log("Fetching orders for user ID:", req.user.id);

    // Fetch user orders
    const [orders] = await connection.execute(
      `SELECT o.*, 
        COALESCE(GROUP_CONCAT(DISTINCT ot.status ORDER BY ot.created_at ASC), '') as tracking_status,
        COALESCE(GROUP_CONCAT(DISTINCT ot.description ORDER BY ot.created_at ASC), '') as tracking_description,
        COALESCE(GROUP_CONCAT(DISTINCT ot.created_at ORDER BY ot.created_at ASC), '') as tracking_dates
      FROM orders o
      LEFT JOIN order_tracking ot ON o.id = ot.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    console.log("Fetched orders:", orders);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Get order items for each order
    for (let order of orders) {
      const [items] = await connection.execute(
        `SELECT oi.*, p.name, p.image_url as image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;

      // Parse tracking information
      if (order.tracking_status) {
        order.tracking = {
          status: order.tracking_status.split(','),
          description: order.tracking_description.split(','),
          dates: order.tracking_dates.split(',')
        };
      }

      // Parse shipping address (handle errors)
      try {
        order.shipping_address = JSON.parse(order.shipping_address);
      } catch (err) {
        console.warn("Invalid JSON in shipping_address:", order.shipping_address);
        order.shipping_address = null;
      }
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } 
});






router.get('/:orderId', auth, async (req, res) => {
  let connection; // Declare connection here
  try {
    // Get connection from pool
    connection = await req.db.getConnection();

    const [orders] = await connection.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.user_id = ?`,
      [req.params.orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await connection.execute(
      `SELECT oi.*, p.name, p.image_url as image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [req.params.orderId]
    );
    order.items = items;

    // Get tracking information
    const [tracking] = await connection.execute(
      `SELECT * FROM order_tracking
      WHERE order_id = ? ORDER BY created_at DESC`,
      [req.params.orderId]
    );
    order.tracking = tracking;

    // Parse shipping address
    try {
      order.shipping_address = JSON.parse(order.shipping_address);
    } catch (err) {
      console.warn("Invalid shipping address JSON:", order.shipping_address);
      order.shipping_address = null;
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
  // No need to manually release the connection when using promise-based connections
});


module.exports = router;
