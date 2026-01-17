const express = require('express');
const router = express.Router();
const ChauffeurController = require('../controllers/chauffeurController');
const { verifyToken } = require('../middleware/auth');
const { validateFcmToken } = require('../middleware/validation');

// Routes chauffeurs
router.get('/', verifyToken, ChauffeurController.lister);
router.post('/:id/fcm-token', verifyToken, validateFcmToken, ChauffeurController.enregistrerFcmToken);

module.exports = router;
