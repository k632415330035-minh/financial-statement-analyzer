const mysql = require("mysql12/promise");

const connection = mysql.createPool({
  host: process.env.DB_HOST_MYSQL,
  port: process.env.DB_PORT_MYSQL,
  user: process.env.DB_USER_MYSQL,
  password: process.env.DB_PASSWORD_MYSQL,
  database: process.env.DB_NAME_MYSQL,
  waitForConnections: true,
  connectionLimit: 10, // Số kết nối tối đa trong pool
  queueLimit: 0,
  charset: "utf8mb4",
});

console.log("✅ MySQL Connection Pool đã được tạo thành công.");

// Export đối tượng pool này
module.exports = connection;
