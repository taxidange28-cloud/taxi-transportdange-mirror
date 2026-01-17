const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const Utilisateur = require('../models/Utilisateur');
const Chauffeur = require('../models/Chauffeur');

class AdminController {
  // Récupérer tous les utilisateurs (secrétaires + chauffeurs)
  static async getAllUsers(req, res) {
    try {
      // Récupérer les secrétaires et admins
      const utilisateursResult = await query(
        'SELECT id, username, role, created_at, NULL as nom FROM utilisateurs WHERE role != $1 ORDER BY created_at DESC',
        ['admin']
      );

      // Récupérer les chauffeurs
      const chauffeursResult = await query(
        'SELECT id, username, nom, created_at, $1 as role FROM chauffeurs ORDER BY created_at DESC',
        ['chauffeur']
      );

      // Combiner les résultats
      const users = [
        ...utilisateursResult.rows,
        ...chauffeursResult.rows
      ];

      res.json(users);
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(req, res) {
    try {
      const { username, password, nom, role } = req.body;

      // Validation
      if (!username || !password || !role) {
        return res.status(400).json({ error: 'Champs requis: username, password, role' });
      }

      if (!['secretaire', 'chauffeur'].includes(role)) {
        return res.status(400).json({ error: 'Le rôle doit être "secretaire" ou "chauffeur"' });
      }

      if (role === 'chauffeur' && !nom) {
        return res.status(400).json({ error: 'Le nom est requis pour les chauffeurs' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser;

      if (role === 'secretaire') {
        // Insérer dans la table utilisateurs
        const result = await query(
          'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
          [username, hashedPassword, 'secretaire']
        );
        newUser = result.rows[0];
        newUser.nom = null;
      } else {
        // Insérer dans la table chauffeurs
        const result = await query(
          'INSERT INTO chauffeurs (username, password, nom) VALUES ($1, $2, $3) RETURNING id, username, nom, created_at',
          [username, hashedPassword, nom]
        );
        newUser = result.rows[0];
        newUser.role = 'chauffeur';
      }

      res.status(201).json(newUser);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
      }
      console.error('Erreur createUser:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Changer le mot de passe d'un utilisateur
  static async changeUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword, role } = req.body;

      if (!newPassword) {
        return res.status(400).json({ error: 'Le nouveau mot de passe est requis' });
      }

      if (!role) {
        return res.status(400).json({ error: 'Le rôle est requis' });
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      if (role === 'secretaire' || role === 'admin') {
        await query(
          'UPDATE utilisateurs SET password = $1 WHERE id = $2',
          [hashedPassword, id]
        );
      } else if (role === 'chauffeur') {
        await query(
          'UPDATE chauffeurs SET password = $1 WHERE id = $2',
          [hashedPassword, id]
        );
      } else {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      console.error('Erreur changeUserPassword:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Modifier les informations d'un utilisateur
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, nom, role } = req.body;

      if (!role) {
        return res.status(400).json({ error: 'Le rôle est requis' });
      }

      if (role === 'secretaire' || role === 'admin') {
        if (username) {
          await query(
            'UPDATE utilisateurs SET username = $1 WHERE id = $2',
            [username, id]
          );
        }
      } else if (role === 'chauffeur') {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (username) {
          fields.push(`username = $${paramCount}`);
          values.push(username);
          paramCount++;
        }

        if (nom) {
          fields.push(`nom = $${paramCount}`);
          values.push(nom);
          paramCount++;
        }

        if (fields.length > 0) {
          values.push(id);
          await query(
            `UPDATE chauffeurs SET ${fields.join(', ')} WHERE id = $${paramCount}`,
            values
          );
        }
      } else {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      res.json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
      }
      console.error('Erreur updateUser:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.query;

      if (!role) {
        return res.status(400).json({ error: 'Le rôle est requis' });
      }

      // Vérifier qu'on ne supprime pas le dernier admin
      if (role === 'admin') {
        const adminsCount = await query(
          'SELECT COUNT(*) FROM utilisateurs WHERE role = $1',
          ['admin']
        );
        if (parseInt(adminsCount.rows[0].count) <= 1) {
          return res.status(400).json({ error: 'Impossible de supprimer le dernier administrateur' });
        }
      }

      // Vérifier qu'on ne supprime pas la seule secrétaire
      if (role === 'secretaire') {
        const secretairesCount = await query(
          'SELECT COUNT(*) FROM utilisateurs WHERE role = $1',
          ['secretaire']
        );
        if (parseInt(secretairesCount.rows[0].count) <= 1) {
          return res.status(400).json({ error: 'Impossible de supprimer la seule secrétaire' });
        }
      }

      // Supprimer l'utilisateur de la table appropriée
      if (role === 'secretaire' || role === 'admin') {
        await query('DELETE FROM utilisateurs WHERE id = $1', [id]);
      } else if (role === 'chauffeur') {
        await query('DELETE FROM chauffeurs WHERE id = $1', [id]);
      } else {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Récupérer les statistiques
  static async getStats(req, res) {
    try {
      // Compter les utilisateurs
      const utilisateursCount = await query(
        'SELECT COUNT(*) FROM utilisateurs WHERE role = $1',
        ['secretaire']
      );

      const chauffeursCount = await query(
        'SELECT COUNT(*) FROM chauffeurs'
      );

      const totalUsers = parseInt(utilisateursCount.rows[0].count) + parseInt(chauffeursCount.rows[0].count);

      // Compter les missions
      const missionsCount = await query('SELECT COUNT(*) FROM missions');

      // Calculer le chiffre d'affaires (missions terminées de type CPAM)
      // Note: Le schéma actuel ne contient pas de prix, donc on retourne 0
      // Cela peut être amélioré si un champ prix est ajouté
      const revenueResult = await query(
        'SELECT COUNT(*) as missions_terminees FROM missions WHERE statut = $1',
        ['terminee']
      );

      res.json({
        totalUsers,
        secretaires: parseInt(utilisateursCount.rows[0].count),
        chauffeurs: parseInt(chauffeursCount.rows[0].count),
        missions: parseInt(missionsCount.rows[0].count),
        missionsTerminees: parseInt(revenueResult.rows[0].missions_terminees),
        // Placeholder pour chiffre d'affaires - nécessite un champ prix dans le schéma
        chiffreAffaires: 0
      });
    } catch (error) {
      console.error('Erreur getStats:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = AdminController;
