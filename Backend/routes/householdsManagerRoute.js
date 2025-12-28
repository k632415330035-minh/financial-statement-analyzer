const express = require("express");
const router = express.Router();
const householdsManagementController = require("../controllers/householdsManagementController");

// Route để lấy thông tin tất cả các hộ khẩu
router.get("/get/allHouseholds", householdsManagementController.getAllHouseholds);
router.get("/get/householdMembers/:householdId", householdsManagementController.getHouseholdMembers);
router.delete("/delete/householdMember/:id_cd", householdsManagementController.deleteHouseholdMember);
router.put("/createNewHouseholdFromMembers", householdsManagementController.createNewHouseholdFromMembers);
router.post("/post/createNewHousehold", householdsManagementController.createNewHousehold);
router.post("/post/household/addNewMember", householdsManagementController.addNewMember);
router.put("/put/updateHousehold/:id_ho_khau", householdsManagementController.updateHousehold);
router.get("/get/changeHistory/:id_ho_khau", householdsManagementController.getChangeHistory);

module.exports = router;