const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/missionController');
const { verifyToken } = require('../middleware/auth');

// Route spéciale pour les missions d'un chauffeur
router.get('/:id/missions', verifyToken, MissionController.listerParChauffeur);

module.exports = router;
