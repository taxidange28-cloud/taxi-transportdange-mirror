const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// Toutes les routes admin sont protégées
router.use(adminAuth);

// GET /api/admin/users - Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    // Récupérer les secrétaires
    const secretaires = await pool.query(
      'SELECT id, username, role, created_at, \'secretaire\' as user_type FROM utilisateurs WHERE role = $1',
      ['secretaire']
    );

    // Récupérer les chauffeurs
    const chauffeurs = await pool.query(
      'SELECT id, username, nom, created_at, \'chauffeur\' as user_type, \'chauffeur\' as role FROM chauffeurs'
    );

    // Récupérer les admins
    const admins = await pool.query(
      'SELECT id, username, role, created_at, \'admin\' as user_type FROM utilisateurs WHERE role = $1',
      ['admin']
    );

    // Combiner tous les utilisateurs
    const allUsers = [
      ...admins.rows,
      ...secretaires.rows,
      ...chauffeurs.rows
    ];

    res.json({ users: allUsers });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/users - Créer un nouvel utilisateur
router.post('/users', async (req, res) => {
  try {
    const { username, password, nom, role } = req.body;

    // Validation
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (!['admin', 'secretaire', 'chauffeur'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    if (role === 'chauffeur') {
      // Insérer dans la table chauffeurs
      if (!nom) {
        return res.status(400).json({ error: 'Le nom est requis pour un chauffeur' });
      }
      result = await pool.query(
        'INSERT INTO chauffeurs (username, password, nom) VALUES ($1, $2, $3) RETURNING id, username, nom',
        [username, hashedPassword, nom]
      );
    } else {
      // Insérer dans la table utilisateurs (admin ou secretaire)
      result = await pool.query(
        'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hashedPassword, role]
      );
    }

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/users/:id/password - Changer le mot de passe
router.put('/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, userType } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'Nouveau mot de passe requis' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour dans la bonne table
    if (userType === 'chauffeur') {
      await pool.query(
        'UPDATE chauffeurs SET password = $1 WHERE id = $2',
        [hashedPassword, id]
      );
    } else {
      await pool.query(
        'UPDATE utilisateurs SET password = $1 WHERE id = $2',
        [hashedPassword, id]
      );
    }

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/users/:id - Modifier un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, nom, userType } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur est requis' });
    }

    let result;
    if (userType === 'chauffeur') {
      result = await pool.query(
        'UPDATE chauffeurs SET username = $1, nom = $2 WHERE id = $3 RETURNING id, username, nom',
        [username, nom, id]
      );
    } else {
      result = await pool.query(
        'UPDATE utilisateurs SET username = $1 WHERE id = $2 RETURNING id, username, role',
        [username, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ 
      message: 'Utilisateur mis à jour avec succès',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.query;

    // Vérifications de sécurité
    if (userType === 'admin') {
      const adminsCount = await pool.query('SELECT COUNT(*) FROM utilisateurs WHERE role = $1', ['admin']);
      if (parseInt(adminsCount.rows[0].count) <= 1) {
        return res.status(400).json({ error: 'Impossible de supprimer le dernier administrateur' });
      }
    }

    // Supprimer de la bonne table
    let result;
    if (userType === 'chauffeur') {
      result = await pool.query('DELETE FROM chauffeurs WHERE id = $1 RETURNING id', [id]);
    } else {
      result = await pool.query('DELETE FROM utilisateurs WHERE id = $1 RETURNING id', [id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/stats - Statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const stats = {};

    // Nombre total d'utilisateurs
    const totalUsers = await pool.query(
      'SELECT (SELECT COUNT(*) FROM utilisateurs) + (SELECT COUNT(*) FROM chauffeurs) as total'
    );
    stats.totalUsers = parseInt(totalUsers.rows[0].total);

    // Nombre de secrétaires
    const secretaires = await pool.query('SELECT COUNT(*) FROM utilisateurs WHERE role = $1', ['secretaire']);
    stats.secretaires = parseInt(secretaires.rows[0].count);

    // Nombre de chauffeurs
    const chauffeurs = await pool.query('SELECT COUNT(*) FROM chauffeurs');
    stats.chauffeurs = parseInt(chauffeurs.rows[0].count);

    // Nombre d'admins
    const admins = await pool.query('SELECT COUNT(*) FROM utilisateurs WHERE role = $1', ['admin']);
    stats.admins = parseInt(admins.rows[0].count);

    // Nombre de missions
    const missions = await pool.query('SELECT COUNT(*) FROM missions');
    stats.missions = parseInt(missions.rows[0].count);

    // Chiffre d'affaires total
    const ca = await pool.query('SELECT COALESCE(SUM(prix), 0) as total FROM missions WHERE statut = $1', ['terminee']);
    stats.chiffreAffaires = parseFloat(ca.rows[0].total);

    res.json({ stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
