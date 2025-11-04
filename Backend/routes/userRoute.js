const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// 1. ROUTE XÁC THỰC (Không cần Token)

// Đăng ký tài khoản mới (Mặc định: "tam thoi")
router.post("/register", userController.createUser);

// Đăng nhập và nhận Token (Chứa role)
router.post("/login", userController.loginUser);

// 2. ROUTE QUẢN LÝ USER (Cần Token)

// Lấy tất cả người dùng
// Chỉ cho phép 'quan ly' xem danh sách đầy đủ
router.get(
  "/users",
  verifyToken, // BƯỚC 1: Xác thực Token
  checkRole(["quan ly"]), // BƯỚC 2: Phân quyền
  userController.getAllUser
);

// Lấy thông tin người dùng bằng CCCD
router.get(
  "/users/:UserID",
  verifyToken,
  userController.getUserById // Ai có Token hợp lệ đều có thể tìm kiếm
);

module.exports = router;
