// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Test database connection
// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Database connected successfully');
//     connection.release();
//   } catch (error) {
//     console.error('Database connection failed:', error.message);
//     process.exit(1);
//   }
// };

// testConnection();

// module.exports = {
//   query: async (sql, params) => {
//     try {
//       const [rows] = await pool.execute(sql, params);
//       return rows;
//     } catch (error) {
//       console.error('Database query error:', error.message);
//       throw error;
//     }
//   }
// };






// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   multipleStatements: true,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });






const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Initialize Database
const initDatabase = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.close(); // safer across versions
  }
  
};

// Execute a Query
const query = async (sql, params) => {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error.message);
    throw error;
  }
};

// Graceful Shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log("Database connection pool closed");
  } catch (error) {
    console.error("Error closing database connection pool:", error.message);
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  await closePool();
  process.exit(0);
});

// Initialize Database Connection
initDatabase();

module.exports = {
  query,
  closePool,
};
