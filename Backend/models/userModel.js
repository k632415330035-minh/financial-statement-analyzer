// userModel.js (Sử dụng Async/Await)
const db = require("../config/dbMySQL"); // Đối tượng Promise Pool

const User = {
  // Chuyển tất cả thành hàm async
  getAll: async () => {
    // [rows, fields] là mảng kết quả
    const [rows] = await db.query("SELECT * FROM accounts");
    return rows;
  },

  getByUserID: async (UserID) => {
    const query =
      "SELECT userID, _password, _type FROM accounts WHERE userID = ?";
    const [rows] = await db.query(query, [UserID]);
    return rows;
  },

  getById: async (UserID) => {
    const query = "SELECT userID, _type FROM accounts WHERE userID = ?";
    const [rows] = await db.query(query, [UserID]);
    return rows;
  },

  create: async (UserID, Password) => {
    const query =
      "INSERT INTO accounts (userID, _password, _type) VALUES (?, ?, 'tam thoi')";
    // Khi INSERT, kết quả trả về là [result, fields], chúng ta lấy object result
    const [result] = await db.query(query, [UserID, Password]);
    return result;
  },
};

module.exports = User;
