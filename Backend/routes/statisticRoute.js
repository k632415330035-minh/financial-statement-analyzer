const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statisticController");

// Import middleware để kiểm tra quyền
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// Cấu hình: Phải có Token hợp lệ và Role là "quan ly" mới xem được
router.get(
    "/dashboard",
    verifyToken,
    checkRole(["quan ly"]),
    statisticController.getDashboardStats
);



module.exports = router;