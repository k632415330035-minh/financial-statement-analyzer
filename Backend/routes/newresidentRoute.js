const express = require("express");
const router = express.Router();
const newresidentRegisterController = require("../controllers/newresidentRegisterController");

router.get(
  "/house/by-cccd/:cccd",
  newresidentRegisterController.getHouseInfoByCCCD
);
router.post(
  "/newregister/existing-house",
  newresidentRegisterController.registerToExistingHouse
);

router.post(
  "/newregister/new-house",
  newresidentRegisterController.registerToNewHouse
);

module.exports = router;
