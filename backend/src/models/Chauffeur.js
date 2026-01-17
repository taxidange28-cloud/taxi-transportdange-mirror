const { query } = require('../config/database');

class Chauffeur {
  static async findAll() {
    const result = await query(
      'SELECT id, username, nom, actif, created_at FROM chauffeurs ORDER BY nom'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM chauffeurs WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await query(
      'SELECT * FROM chauffeurs WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async updateFcmToken(id, fcmToken) {
    await query(
      'UPDATE chauffeurs SET fcm_token = $1 WHERE id = $2',
      [fcmToken, id]
    );
  }

  static async create(username, hashedPassword, nom) {
    const result = await query(
      'INSERT INTO chauffeurs (username, password, nom) VALUES ($1, $2, $3) RETURNING id, username, nom, actif',
      [username, hashedPassword, nom]
    );
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    await query(
      'UPDATE chauffeurs SET password = $1 WHERE id = $2',
      [hashedPassword, id]
    );
  }

  static async setActif(id, actif) {
    await query(
      'UPDATE chauffeurs SET actif = $1 WHERE id = $2',
      [actif, id]
    );
  }
}

module.exports = Chauffeur;
