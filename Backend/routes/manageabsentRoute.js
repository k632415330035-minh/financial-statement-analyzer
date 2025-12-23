const express = require('express');
const router = express.Router();
const manageabsentController = require('../controllers/manageabsentController');

router.get('/dashboard', manageabsentController.getDashboard);

module.exports = router;