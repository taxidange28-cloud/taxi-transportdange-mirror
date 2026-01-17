const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const Chauffeur = require('../models/Chauffeur');

class AuthController {
  // Connexion
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Chercher d'abord dans les utilisateurs (secrétaire et admin)
      let user = await Utilisateur.findByUsername(username);
      let role = null;
      let userId = null;

      if (user) {
        // Utilisateur trouvé dans la table utilisateurs (secrétaire ou admin)
        role = user.role;
      } else {
        // Si pas trouvé, chercher dans les chauffeurs
        user = await Chauffeur.findByUsername(username);
        role = 'chauffeur';
      }

      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      userId = user.id;

      // Générer le token JWT
      const token = jwt.sign(
        { userId, username: user.username, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        token,
        user: {
          id: userId,
          username: user.username,
          role,
          nom: user.nom || null,
        },
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Récupérer l'utilisateur connecté
  static async me(req, res) {
    try {
      let userData;
      
      if (req.user.role === 'secretaire' || req.user.role === 'admin') {
        userData = await Utilisateur.findById(req.user.userId);
      } else if (req.user.role === 'chauffeur') {
        userData = await Chauffeur.findById(req.user.userId);
      }

      if (!userData) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        id: userData.id,
        username: userData.username,
        role: req.user.role,
        nom: userData.nom || null,
      });
    } catch (error) {
      console.error('Erreur me:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Déconnexion (côté client, suppression du token)
  static async logout(req, res) {
    res.json({ message: 'Déconnexion réussie' });
  }
}

module.exports = AuthController;
