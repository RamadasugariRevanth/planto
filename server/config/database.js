const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  let connection;
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
      waitForConnections: true,
      connectionLimit: 10, // Adjust based on your needs
      queueLimit: 0,
    });

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Create tables if they don't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        shipping_details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image_url VARCHAR(255),
        category VARCHAR(50),
        sales_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        shipping_address JSON NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS order_tracking (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `);

    console.log('Database tables created successfully');

    // Insert sample products if none exist
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (products[0].count === 0) {
      await connection.query(`
        INSERT INTO products (name, description, price, stock, image_url, category) VALUES
        ('Snake Plant', 'Easy to care indoor plant', 29.99, 50, 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600', 'indoor'),
        ('Peace Lily', 'Beautiful flowering indoor plant', 34.99, 30, 'https://images.unsplash.com/photo-1593691509543-c55fb32e7332?w=600', 'indoor'),
        ('Monstera Deliciosa', 'Popular tropical plant', 49.99, 25, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600', 'indoor'),
                ('Tomato Plant', 'Fresh vegetable plant', 8.99, 100, 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600', 'outdoor'),
        ('Rose Bush', 'Beautiful flowering bush', 24.99, 40, 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600', 'outdoor'),
        ('Succulent Collection', 'Set of 3 different succulents', 19.99, 60, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600', 'succulents'),
        ('Garden Tool Set', 'Essential gardening tools', 39.99, 20, 'https://images.unsplash.com/photo-1617576683096-00b987ea5c26?w=600', 'supplies'),
        ('Organic Fertilizer', 'Natural plant food', 14.99, 75, 'https://images.unsplash.com/photo-1589324307159-8f4c780f481b?w=600', 'supplies')
      `);
      console.log('Sample products inserted successfully');
    }

    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
    if (connection) {
      connection.release(); // Ensure the connection is released on error
    }
    process.exit(1);
  }
};

module.exports = initDatabase;