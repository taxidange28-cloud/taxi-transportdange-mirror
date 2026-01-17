const { query } = require('../config/database');

class Utilisateur {
  static async findByUsername(username) {
    const result = await query(
      'SELECT * FROM utilisateurs WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, username, role, created_at FROM utilisateurs WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(username, hashedPassword, role = 'secretaire') {
    const result = await query(
      'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, hashedPassword, role]
    );
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    await query(
      'UPDATE utilisateurs SET password = $1 WHERE id = $2',
      [hashedPassword, id]
    );
  }
}

module.exports = Utilisateur;
