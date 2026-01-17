const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/missionController');
const { verifyToken, requireSecretaire, requireChauffeur } = require('../middleware/auth');
const { validateMission, validateMissionUpdate, validateCommentaire } = require('../middleware/validation');
const { runMigration } = require('../../migrate');

// Migration endpoint - REMOVE AFTER RUNNING MIGRATION IN PRODUCTION
// This endpoint is intentionally unauthenticated for one-time migration convenience
// TODO: Remove this endpoint after migration is complete
router.get('/migrate', async (req, res) => {
  try {
    const result = await runMigration();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes secrétaire
router.post('/', verifyToken, requireSecretaire, validateMission, MissionController.creer);
router.get('/', verifyToken, requireSecretaire, MissionController.lister);
router.get('/:id', verifyToken, MissionController.obtenir);
router.put('/:id', verifyToken, requireSecretaire, validateMissionUpdate, MissionController.modifier);
router.delete('/:id', verifyToken, requireSecretaire, MissionController.supprimer);
router.post('/:id/envoyer', verifyToken, requireSecretaire, MissionController.envoyer);
router.post('/envoyer-date', verifyToken, requireSecretaire, MissionController.envoyerParDate);

// Routes chauffeur
router.post('/:id/confirmer', verifyToken, requireChauffeur, MissionController.confirmer);
router.post('/:id/pec', verifyToken, requireChauffeur, MissionController.priseEnCharge);
router.post('/:id/terminer', verifyToken, requireChauffeur, MissionController.terminer);
router.post('/:id/commentaire', verifyToken, validateCommentaire, MissionController.ajouterCommentaire);

// Route temporaire pour corriger les dates NULL
router.post('/fix-dates', verifyToken, requireSecretaire, async (req, res) => {
  try {
    const db = require('../config/database');
    
    // Correction pour PostgreSQL
    const result = await db.query(
      `UPDATE missions 
       SET date_mission = CURRENT_DATE 
       WHERE date_mission IS NULL`
    );
    
    // PostgreSQL retourne result.rowCount au lieu de affectedRows
    const rowsAffected = result.rowCount || result.affectedRows || 0;
    
    res.json({ 
      success: true, 
      message: 'Dates corrigées avec succès',
      rowsAffected: rowsAffected
    });
  } catch (error) {
    console.error('Erreur correction dates:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
