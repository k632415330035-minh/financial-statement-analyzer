const express = require("express");
const router = express.Router();
const temporaryController = require("../controllers/temporaryManagementController");

router.get("/get/allTemp", temporaryController.getAllTemp);
module.exports = router;