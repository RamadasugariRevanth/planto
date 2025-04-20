const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Generate proper password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Update or create admin user with correct password hash
    await connection.execute(`
      INSERT INTO users (name, email, password, role) 
      VALUES ('Admin', 'admin@planto.com', ?, 'admin')
      ON DUPLICATE KEY UPDATE password = ?
    `, [hashedPassword, hashedPassword]);

    console.log('Admin user created/updated successfully');
    console.log('Email: admin@planto.com');
    console.log('Password: admin123');

    await connection.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
