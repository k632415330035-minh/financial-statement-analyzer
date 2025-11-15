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

    // 1. KIỂM TRA SỰ TỒN TẠI TRƯỚC (Dùng await)
    const existingUsers = await User.getByUserID(UserID);

    if (existingUsers.length > 0) {
      return res.status(409).send({ message: "Mã CCCD này đã được đăng ký." });
    }

    // **LƯU Ý BẢO MẬT: MẬT KHẨU VẪN CHƯA BĂM TRONG CODE NÀY**
    // 2. TẠO TÀI KHOẢN NẾU CHƯA TỒN TẠI
    await User.create(UserID, Password);

    // 3. THÀNH CÔNG
    res
      .status(201)
      .json({ UserID, _type: "tam thoi", message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Lỗi tạo tài khoản:", err);
    // Xử lý lỗi trùng lặp khi create (dự phòng)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).send({ message: "Mã CCCD này đã được đăng ký." });
    }
    return res
      .status(500)
      .send({ message: "Lỗi tạo tài khoản.", error: err.message });
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
