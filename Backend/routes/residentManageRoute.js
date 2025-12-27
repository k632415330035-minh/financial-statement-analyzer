const express = require('express');
const router = express.Router();
const residentManageController = require('../controllers/residentManageController.js');

// Endpoint: GET /api/residentManage/dashboard
router.get('/dashboard', residentManageController.getDashboardData);
router.put('/update/:id', residentManageController.updateResident);
module.exports = router;