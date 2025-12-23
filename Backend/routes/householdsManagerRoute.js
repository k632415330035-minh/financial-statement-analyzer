const express = require("express");
const router = express.Router();
const householdsManagementController = require("../controllers/householdsManagementController");

// Route để lấy thông tin tất cả các hộ khẩu
router.get("/get/allHouseholds", householdsManagementController.getAllHouseholds);
router.get("/get/householdMembers/:householdId", householdsManagementController.getHouseholdMembers);
router.delete("/delete/householdMember/:id_cd", householdsManagementController.deleteHouseholdMember);
router.put("/createNewHouseholdFromMembers", householdsManagementController.createNewHouseholdFromMembers);
module.exports = router;