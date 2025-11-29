const express = require("express");
const statisticController = require("../controllers/statisticController");
const router = express.Router();

router.get("/dashboard", statisticController.getDashboardStats);

module.exports = router;