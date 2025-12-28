const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: process.env.DB_HOST_MYSQL || "localhost",
  port: process.env.DB_PORT_MYSQL || 3306,
  user: process.env.DB_USER_MYSQL || "root",
  password: process.env.DB_PASSWORD_MYSQL || "clear",
  database: process.env.DB_NAME_MYSQL || "MANAGE",
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10, // Số kết nối tối đa trong pool
  queueLimit: 0,
  charset: "utf8mb4",
});

console.log("✅ MySQL Connection Pool đã được tạo thành công.");

// Export đối tượng pool này
module.exports = connection;
