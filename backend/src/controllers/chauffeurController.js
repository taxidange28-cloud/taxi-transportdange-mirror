const Chauffeur = require('../models/Chauffeur');

class ChauffeurController {
  // Lister tous les chauffeurs
  static async lister(req, res) {
    try {
      const chauffeurs = await Chauffeur.findAll();
      res.json(chauffeurs);
    } catch (error) {
      console.error('Erreur liste chauffeurs:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Enregistrer le token FCM d'un chauffeur
  static async enregistrerFcmToken(req, res) {
    try {
      const chauffeurId = parseInt(req.params.id);
      const { fcm_token } = req.body;

      // Vérifier que le chauffeur accède bien à son propre profil
      if (req.user.role === 'chauffeur' && req.user.userId !== chauffeurId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      await Chauffeur.updateFcmToken(chauffeurId, fcm_token);
      res.json({ message: 'Token FCM enregistré' });
    } catch (error) {
      console.error('Erreur enregistrement token FCM:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = ChauffeurController;
