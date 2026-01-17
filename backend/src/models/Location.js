const { pool } = require('../config/database');

class Location {
  static async create(data) {
    const { chauffeur_id, latitude, longitude, accuracy, speed, heading, is_active } = data;
    
    if (!chauffeur_id) {
      console.error('❌ chauffeur_id manquant ou invalide lors de l\'enregistrement de la position GPS !');
      throw new Error('chauffeur_id manquant ou invalide');
    }
    
    const query = `
      INSERT INTO positions_gps 
        (chauffeur_id, latitude, longitude, accuracy, speed, heading, is_active, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const values = [chauffeur_id, latitude, longitude, accuracy, speed, heading, is_active];
    
    try {
      const result = await pool.query(query, values);
      console.log('✅ Position GPS enregistrée:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur création position GPS:', error.message);
      throw error;
    }
  }

  static async getLatestByChauffeurId(chauffeurId) {
    const query = `
      SELECT * FROM positions_gps 
      WHERE chauffeur_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [chauffeurId]);
      const row = result.rows[0];
      
      if (!row) return null;
      
      return {
        ...row,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        accuracy: row.accuracy ? parseInt(row.accuracy) : null,
        speed: row.speed ? parseFloat(row.speed) : null,
        heading: row.heading ? parseFloat(row.heading) : null,
      };
    } catch (error) {
      console.error('❌ Erreur récupération dernière position:', error.message);
      throw error;
    }
  }

  static async getAllActivePositions() {
    const query = `
      SELECT DISTINCT ON (p.chauffeur_id)
        p.*,
        c.nom as chauffeur_nom,
        c.username as chauffeur_username
      FROM positions_gps p
      INNER JOIN chauffeurs c ON p.chauffeur_id = c.id
      WHERE p.timestamp > NOW() - INTERVAL '5 minutes'
        AND c.actif = TRUE
      ORDER BY p.chauffeur_id, p.timestamp DESC
    `;
    
    try {
      const result = await pool.query(query);
      console.log(`📍 ${result.rows.length} position(s) active(s) récupérée(s)`);
      
      return result.rows.map(row => ({
        ...row,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        accuracy: row.accuracy ? parseInt(row.accuracy) : null,
        speed: row.speed ? parseFloat(row.speed) : null,
        heading: row.heading ? parseFloat(row.heading) : null,
      }));
    } catch (error) {
      console.error('❌ Erreur récupération positions actives:', error.message);
      throw error;
    }
  }

  static async getHistory(chauffeurId, limit = 50) {
    const query = `
      SELECT * FROM positions_gps 
      WHERE chauffeur_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `;
    
    try {
      const result = await pool.query(query, [chauffeurId, limit]);
      
      return result.rows.map(row => ({
        ...row,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        accuracy: row.accuracy ? parseInt(row.accuracy) : null,
        speed: row.speed ? parseFloat(row.speed) : null,
        heading: row.heading ? parseFloat(row.heading) : null,
      }));
    } catch (error) {
      console.error('❌ Erreur récupération historique:', error.message);
      throw error;
    }
  }

  static async setInactive(chauffeurId) {
    const query = `
      UPDATE positions_gps 
      SET is_active = false 
      WHERE chauffeur_id = $1 AND is_active = true
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [chauffeurId]);
      console.log(`🛑 Position(s) marquée(s) inactive(s) pour chauffeur ${chauffeurId}`);
      return result.rows;
    } catch (error) {
      console.error('❌ Erreur marquage inactif:', error.message);
      throw error;
    }
  }

  static async cleanOldPositions(days = 7) {
    const query = `
      DELETE FROM positions_gps 
      WHERE timestamp < NOW() - INTERVAL '${days} days'
      RETURNING COUNT(*) as deleted_count
    `;
    
    try {
      const result = await pool.query(query);
      console.log(`🗑️ ${result.rows[0]?.deleted_count || 0} position(s) supprimée(s)`);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erreur nettoyage positions:', error.message);
      throw error;
    }
  }
}

module.exports = Location;
