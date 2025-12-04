const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerResidentController");

router.post(
  "/dangky-thuongtru-con",
  registerController.handleNewbornRegistration
);

module.exports = router;
