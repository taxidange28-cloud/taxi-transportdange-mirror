const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, nom, created_at FROM chauffeurs ORDER BY nom ASC'
    );
    res.json({ chauffeurs: result.rows });
  } catch (error) {
    console.error('Erreur récupération chauffeurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, password, nom } = req.body;

    if (!username || !password || !nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO chauffeurs (username, password, nom, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, nom, created_at',
      [username, hashedPassword, nom]
    );

    res.status(201).json({ 
      message: 'Chauffeur créé avec succès',
      chauffeur: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur création chauffeur:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, nom } = req.body;

    if (!username || !nom) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur et le nom sont requis' });
    }

    const result = await pool.query(
      'UPDATE chauffeurs SET username = $1, nom = $2 WHERE id = $3 RETURNING id, username, nom, created_at',
      [username, nom, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    res.json({ 
      message: 'Chauffeur modifié avec succès',
      chauffeur: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur modification chauffeur:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'Nouveau mot de passe requis' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      'UPDATE chauffeurs SET password = $1 WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const missionsCount = await pool.query(
      'SELECT COUNT(*) FROM missions WHERE chauffeur_id = $1',
      [id]
    );

    if (parseInt(missionsCount.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer ce chauffeur car il a des missions associées' 
      });
    }

    const result = await pool.query(
      'DELETE FROM chauffeurs WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }

    res.json({ message: 'Chauffeur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression chauffeur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
