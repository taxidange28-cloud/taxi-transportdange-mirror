const express = require('express');
const router = express.Router();
const ExportController = require('../controllers/exportController');
const { verifyToken, requireSecretaire } = require('../middleware/auth');
const { validateDateParams } = require('../middleware/validation');

// Route export Excel
router.get('/excel', verifyToken, requireSecretaire, validateDateParams, ExportController.exporterExcel);

module.exports = router;
