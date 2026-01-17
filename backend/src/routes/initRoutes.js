const express = require('express');
const router = express.Router();
const { initDatabase } = require('../config/initDatabase');

// Route pour initialiser la base de données (à appeler une seule fois)
router.post('/init-db', async (req, res) => {
  try {
    console.log('🔧 Initialisation de la base de données...');
    await initDatabase();
    console.log('✅ Base de données initialisée avec succès !');
    res.json({ 
      success: true, 
      message: 'Base de données initialisée avec succès !' 
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'initialisation de la base de données'
    });
  }
});

module.exports = router;
