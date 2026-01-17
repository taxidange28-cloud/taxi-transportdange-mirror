const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const Chauffeur = require('../models/Chauffeur');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Authorization header manquant ou invalide');
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('🔐 Token décodé:', decoded);

      // Support pour userId OU id
      if (decoded.userId && !decoded.id) {
        decoded.id = decoded.userId;
      }

      req.user = decoded;
      
      console.log('✅ req.user après traitement:', req.user);
      
      next();
    } catch (error) {
      console.error('❌ Erreur vérification token:', error.message);
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
  } catch (error) {
    console.error('❌ Erreur middleware auth:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const requireSecretaire = (req, res, next) => {
  if (req.user.role !== 'secretaire') {
    return res.status(403).json({ error: 'Accès réservé à la secrétaire' });
  }
  next();
};

const requireChauffeur = (req, res, next) => {
  if (req.user.role !== 'chauffeur') {
    return res.status(403).json({ error: 'Accès réservé aux chauffeurs' });
  }
  next();
};

const loadUserData = async (req, res, next) => {
  try {
    if (req.user.role === 'secretaire') {
      const utilisateur = await Utilisateur.findById(req.user.id || req.user.userId);
      req.userData = utilisateur;
    } else if (req.user.role === 'chauffeur') {
      const chauffeur = await Chauffeur.findById(req.user.id || req.user.userId);
      req.userData = chauffeur;
    }
    next();
  } catch (error) {
    console.error('Erreur chargement données utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  verifyToken,
  requireSecretaire,
  requireChauffeur,
  loadUserData,
};
