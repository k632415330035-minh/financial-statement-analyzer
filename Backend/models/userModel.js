const db = require("../config/dbMySQL"); // Đối tượng Promise Pool

const User = {
  // Lấy tất cả tài khoản
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM accounts");
    return rows;
  },

  // Lấy tài khoản theo userID
  getByUserID: async (UserID) => {
    const query =
      "SELECT userID, _password, _type FROM accounts WHERE userID = ?";
    const [rows] = await db.query(query, [UserID]);
    return rows;
  },

  // Lấy thông tin cơ bản theo userID
  getById: async (UserID) => {
    const query = "SELECT userID, _type FROM accounts WHERE userID = ?";
    const [rows] = await db.query(query, [UserID]);
    return rows;
  },

  create: async (UserID, Password) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      let userType = "tam thoi";
      let idCd = null;

      // 1. Tìm id_cd từ bảng cong_dan dựa trên số CCCD nhập vào
      const [congDanRows] = await conn.query(
        "SELECT id_cd FROM cong_dan WHERE cccd = ? LIMIT 1",
        [UserID]
      );

      if (congDanRows.length > 0) {
        idCd = congDanRows[0].id_cd;

        // 2. Kiểm tra xem id_cd này đã có mặt trong bảng nhan_khau (đã được duyệt vào hộ) chưa
        const [nhanKhauRows] = await conn.query(
          "SELECT 1 FROM nhan_khau WHERE id_cd = ? LIMIT 1",
          [idCd]
        );

        // Nếu tìm thấy trong nhan_khau, xác định là 'cu dan'
        if (nhanKhauRows.length > 0) {
          userType = "cu dan";
        }
      }

      // 3. Tiến hành tạo tài khoản trong bảng accounts
      const queryAccount =
        "INSERT INTO accounts (userID, _password, _type) VALUES (?, ?, ?)";
      await conn.query(queryAccount, [UserID, Password, userType]);

      // 4. Cập nhật userID vào bảng cong_dan nếu người này đã tồn tại trong hệ thống
      if (idCd) {
        await conn.query("UPDATE cong_dan SET userID = ? WHERE id_cd = ?", [
          UserID,
          idCd,
        ]);
      }

      await conn.commit();
      return { success: true, userID: UserID, type: userType };
    } catch (error) {
      await conn.rollback();
      console.error("Lỗi trong quá trình tạo tài khoản:", error);
      throw error;
    } finally {
      conn.release();
    }
  },
};

module.exports = User;
