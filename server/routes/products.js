const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const path = require('path');
const { query } = require('../config/db'); // Adjust path based on your project structure


const multer = require('multer');

// Configure storage and filename for uploaded files


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const name = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'); // remove problematic characters
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + name);
  }
});


const upload = multer({ storage });


// Helper function to validate and format image URL
const formatImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/300?text=No+Image';
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If it's a local path, ensure it starts with /static
  if (!imageUrl.startsWith('/static')) {
    return path.join('/static', imageUrl);
  }

  return imageUrl;
};



// // Get all products with filters
// router.get('/', async (req, res) => {
//   try {
//     const { category, minPrice, maxPrice, sortBy, search } = req.query;
    
//     let sql = 'SELECT * FROM products WHERE 1=1';
//     const params = [];

//     // Apply filters
//     if (category && category !== 'all') {
//       sql += ' AND category = ?';
//       params.push(category);
//     }

//     if (minPrice) {
//       sql += ' AND price >= ?';
//       params.push(parseFloat(minPrice));
//     }

//     if (maxPrice) {
//       sql += ' AND price <= ?';
//       params.push(parseFloat(maxPrice));
//     }

//     if (search) {
//       sql += ' AND (name LIKE ? OR description LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm);
//     }

//     // Apply sorting
//     switch (sortBy) {
//       case 'price_low':
//         sql += ' ORDER BY price ASC';
//         break;
//       case 'price_high':
//         sql += ' ORDER BY price DESC';
//         break;
//       case 'newest':
//         sql += ' ORDER BY created_at DESC';
//         break;
//       case 'popular':
//         sql += ' ORDER BY sales_count DESC';
//         break;
//       default:
//         sql += ' ORDER BY created_at DESC';
//     }

//     const products = await query(sql, params);

//     // Format image URLs (Ensure formatImageUrl function is defined elsewhere)
//     products.forEach(product => {
//       product.image_url = formatImageUrl(product.image_url);
//     });

//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: 'Error fetching products', error: error.message });
//   }
// });



router.get('/', async (req, res) => {
  try {
    const products = await query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});




// router.get('/', async (req, res) => {
//   try {
//     let { category, minPrice, maxPrice, search } = req.query;

//     let queryStr = 'SELECT * FROM products WHERE 1=1';
//     let queryParams = [];

//     if (category && category !== 'all') {
//       queryStr += ' AND category = ?';
//       queryParams.push(category);
//     }

//     if (minPrice) {
//       const min = parseFloat(minPrice);
//       if (!isNaN(min)) {
//         queryStr += ' AND price >= ?';
//         queryParams.push(min);
//       }
//     }

//     if (maxPrice) {
//       const max = parseFloat(maxPrice);
//       if (!isNaN(max)) {
//         queryStr += ' AND price <= ?';
//         queryParams.push(max);
//       }
//     }

//     if (search) {
//       queryStr += ' AND (name LIKE ? OR description LIKE ?)';
//       queryParams.push(`%${search}%`, `%${search}%`);
//     }

//     // 🔹 Debugging: Print final query and parameters
//     console.log('Executing SQL:', queryStr);
//     console.log('With Parameters:', queryParams);

//     const products = await query(queryStr, queryParams);
//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: 'Error fetching products' });
//   }
// });




// // Get product by ID
// router.get('/:id', async (req, res) => {
//   const connection = await req.db.getConnection();
//   try {
//     const [products] = await connection.execute(
//       'SELECT * FROM products WHERE id = ?',
//       [req.params.id]
//     );

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = products[0];
//     product.image_url = formatImageUrl(product.image_url);

//     res.json(product);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).json({ message: 'Error fetching product', error: error.message });
//   } finally {
//     connection.release();
//   }
// });


// Create new product (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { name, description, price, stock, category } = req.body;
    const imageFile = req.file; // This is your uploaded image

    // Validation
    if (!name?.trim() || !description?.trim() || isNaN(price) || isNaN(stock) || !category?.trim()) {
      return res.status(400).json({ message: 'All fields are required except image' });
    }

    const imageUrl = imageFile ? `uploads/${Date.now()}_${imageFile.originalname}` : null; // or process image as needed

    const connection = await req.db.getConnection();
    const [result] = await connection.execute(
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

  const connection = await req.db.getConnection();
  try {
    const { name, description, price, stock, image_url, category } = req.body;
    const formattedImageUrl = formatImageUrl(image_url);

    const [result] = await connection.execute(
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
  } finally {
    connection.release();
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
