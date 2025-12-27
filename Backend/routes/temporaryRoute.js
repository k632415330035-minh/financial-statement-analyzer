const express = require("express");
const router = express.Router();
const temporaryController = require("../controllers/temporaryManagementController");

router.get("/get/allTemp", temporaryController.getAllTemp);
router.get("/get/tempDetail/:id", temporaryController.getTempDetail);
module.exports = router;