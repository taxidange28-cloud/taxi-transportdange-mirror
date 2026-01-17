const express = require('express');
const router = express.Router();
const { verifyToken, requireSecretaire } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Envoyer une notification à un chauffeur spécifique
router.post(
  '/send',
  verifyToken,
  requireSecretaire,
  notificationController. sendNotificationToDriver
);

// Envoyer une notification à tous les chauffeurs
router. post(
  '/send-all',
  verifyToken,
  requireSecretaire,
  notificationController.sendNotificationToAllDrivers
);

module.exports = router;
