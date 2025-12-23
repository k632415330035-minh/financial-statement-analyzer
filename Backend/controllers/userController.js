const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "b6bd6e53e4605f46aa613fff016aa75a7e8d2b24f00c138a578105e534d361e07efaacaf0ec307caa39586a2c0f7a1f50e56e96de4934a74ef4e9a8b81e73aab";

exports.getAllUser = async (req, res) => {
  try {
    const results = await User.getAll();
    res.json(results);
  } catch (err) {
    console.error("Lỗi getAllUser:", err);
    return res.status(500).send(err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const results = await User.getById(req.params.UserID);
    if (results.length === 0) return res.status(404).send("Không tìm thấy");
    res.json(results[0]);
  } catch (err) {
    console.error("Lỗi getUserById:", err);
    return res.status(500).send(err.message);
  }
};

// Đăng ký tài khoản mới
exports.createUser = async (req, res) => {
  try {
    const { UserID, Password } = req.body;

    // 1. KIỂM TRA TỒN TẠI
    const existingUsers = await User.getByUserID(UserID);
    if (existingUsers.length > 0) {
      return res
        .status(409)
        .send({ message: "Mã CCCD này đã được đăng ký tài khoản." });
    }

    // 2. TẠO TÀI KHOẢN (Model sẽ tự check 'cu dan' hay 'tam thoi')
    await User.create(UserID, Password);

    // 3. LẤY LẠI THÔNG TIN VỪA TẠO ĐỂ BIẾT TYPE CHÍNH XÁC
    const newUsers = await User.getByUserID(UserID);
    const newUser = newUsers[0];

    // 4. PHẢN HỒI THÀNH CÔNG VỚI TYPE THỰC TẾ
    res.status(201).json({
      UserID: newUser.userID,
      _type: newUser._type, // Trả về 'cu dan' hoặc 'tam thoi' tùy kết quả Model check
      message: "Đăng ký tài khoản thành công.",
    });
  } catch (err) {
    console.error("Lỗi tạo tài khoản:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).send({ message: "Mã CCCD này đã được đăng ký." });
    }
    return res
      .status(500)
      .send({ message: "Lỗi hệ thống khi tạo tài khoản.", error: err.message });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const { UserID, Password } = req.body;

    if (!UserID || !Password) {
      return res.status(400).send("Thiếu tên đăng nhập hoặc mật khẩu.");
    }

    const results = await User.getByUserID(UserID);

    if (results.length === 0) {
      return res
        .status(401)
        .send("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }

    const user = results[0];

    if (user._password === Password) {
      // Tạo token
      const tokenPayload = {
        userID: user.userID,
        role: user._type,
      };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

      res.json({
        message: "Đăng nhập thành công",
        token: token,
        userID: user.userID,
        role: user._type,
      });
    } else {
      res.status(401).send("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
  } catch (err) {
    console.error("Lỗi login:", err);
    return res.status(500).send(err.message);
  }
};
