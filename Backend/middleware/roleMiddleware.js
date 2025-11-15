// roleMiddleware.js (Chỉ cần req.user.role có tồn tại)

module.exports = function (allowedRoles) {
  return (req, res, next) => {
    // req.user đã được gán bởi Auth Middleware
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Truy cập bị từ chối: Thiếu thông tin vai trò.",
      });
    }

    const userRole = req.user.role;

    // LOGIC PHÂN QUYỀN
    if (allowedRoles.includes(userRole)) {
      next(); // Phân quyền thành công
    } else {
      // Không được phép truy cập
      res.status(403).json({
        message: "Bạn không có đủ quyền truy cập tài nguyên này.",
      });
    }
  };
};
