const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { verifyToken } = require('../middleware/auth');

// Toujours vérifier le token (auth) sur toutes les routes ici
router.use(verifyToken);

// Mise à jour de position par le chauffeur (ancienne route, toujours supportée)
router.post('/update', async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed, heading } = req.body;
    console.log('📍 Requête géolocalisation reçue');
    console.log('   User:', req.user);
    console.log('   Body:', { latitude, longitude, accuracy });

    if (!req.user) {
      console.error('❌ req.user est undefined - token manquant ?');
      return res.status(401).json({ error: 'Non authentifié' });
    }
    const chauffeurId = req.user.id;
    if (!chauffeurId) {
      console.error('❌ chauffeurId est undefined - req.user.id manquant');
      return res.status(400).json({ error: 'ID chauffeur manquant' });
    }
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude et longitude requises' });
    }
    if (req.user.role !== 'chauffeur') {
      return res.status(403).json({ error: 'Réservé aux chauffeurs' });
    }

    const location = await Location.create({
      chauffeur_id: chauffeurId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: accuracy ? parseInt(accuracy) : null,
      speed: speed ? parseFloat(speed) : null,
      heading: heading ? parseFloat(heading) : null,
      is_active: true,
    });

    console.log('✅ Position enregistrée:', location.id);

    // Diffusion websocket
    const io = req.app.get('io');
    io.emit('geolocation:update', {
      chauffeur_id: chauffeurId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: location.timestamp,
    });

    res.json({ 
      success: true, 
      message: 'Position enregistrée',
      location 
    });
  } catch (error) {
    console.error('❌ Erreur enregistrement position:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Alias : envoi de position POST (nouvelle route préférée)
router.post('/position', async (req, res) => {
  try {
    const { latitude, longitude, precision } = req.body;
    const chauffeurId = req.user.id;
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude et longitude requises',
      });
    }
    if (req.user.role !== 'chauffeur') {
      return res.status(403).json({
        success: false,
        error: 'Réservé aux chauffeurs',
      });
    }

    console.log(`📍 Position GPS reçue de chauffeur ${chauffeurId}`);

    const location = await Location.create({
      chauffeur_id: chauffeurId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: precision ? parseInt(precision) : null,
      speed: null,
      heading: null,
      is_active: true,
    });

    console.log('✅ Position enregistrée:', {
      latitude: location.latitude,
      longitude: location.longitude,
      precision: location.accuracy,
    });

    // Diffusion via WebSocket
    const io = req.app.get('io');
    io.emit('geolocation:update', {
      chauffeur_id: chauffeurId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: location.timestamp,
    });

    res.json({
      success: true,
      message: 'Position enregistrée',
      data: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: location.timestamp,
      },
    });
  } catch (error) {
    console.error('❌ Erreur enregistrement position:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// Récupérer toutes les positions actives (pour secrétaire)
router.get('/active', async (req, res) => {
  try {
    if (req.user.role !== 'secretaire') {
      return res.status(403).json({ error: 'Réservé aux secrétaires' });
    }
    const positions = await Location.getAllActivePositions();
    res.json({ positions });
  } catch (error) {
    console.error('Erreur récupération positions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupère la dernière position d'un chauffeur donné
router.get('/chauffeur/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'secretaire' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const position = await Location.getLatestByChauffeurId(id);
    if (!position) {
      return res.status(404).json({ error: 'Aucune position trouvée' });
    }
    res.json({ position });
  } catch (error) {
    console.error('Erreur récupération position chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Historique des positions pour un chauffeur (admin/secrétaire)
router.get('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    if (req.user.role !== 'secretaire') {
      return res.status(403).json({ error: 'Réservé aux secrétaires' });
    }
    const history = await Location.getHistory(id, limit);
    res.json({ history });
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Déconnexion/désactivation de la position (chauffeur)
router.post('/disconnect', async (req, res) => {
  try {
    const chauffeurId = req.user.id;
    if (req.user.role !== 'chauffeur') {
      return res.status(403).json({ error: 'Réservé aux chauffeurs' });
    }
    await Location.setInactive(chauffeurId);
    const io = req.app.get('io');
    io.emit('geolocation:chauffeur-offline', { chauffeur_id: chauffeurId });
    res.json({ success: true, message: 'Position marquée inactive' });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
