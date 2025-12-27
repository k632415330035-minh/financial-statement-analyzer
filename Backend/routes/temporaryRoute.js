const express = require("express");
const router = express.Router();
const temporaryController = require("../controllers/temporaryManagementController");

router.get("/get/allTemp", temporaryController.getAllTemp);
router.get("/get/tempDetail/:id", temporaryController.getTempDetail);
router.put("/action/approveTemp/:id", temporaryController.approveTempRecord);
router.put("/action/rejectTemp/:id", temporaryController.rejectTempRecord);
router.get("/get/tamtruTemp", temporaryController.getTamTruTemp);
module.exports = router;