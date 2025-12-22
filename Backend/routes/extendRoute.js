const express = require("express");
const router = express.Router();
const extendController = require("../controllers/extendController");

router.get("/status/:cccd", extendController.checkStatus);
router.post("/request/:cccd", extendController.extendResident);

module.exports = router;
