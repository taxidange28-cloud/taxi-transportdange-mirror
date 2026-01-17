const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur a le rôle admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
    }

    // Ajouter les infos utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification admin:', error);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = adminAuth;
