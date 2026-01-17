const { pool } = require('../config/database');

const runMigrations = async () => {
  try {
    console.log('🔄 Vérification des migrations...');

    // Vérification de l'existence de la table positions_gps
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'positions_gps'
      );
    `);

    if (!checkTable.rows[0]?.exists) {
      console.log('📍 Création de la table positions_gps...');

      await pool.query(`
        CREATE TABLE positions_gps (
          id SERIAL PRIMARY KEY,
          chauffeur_id INTEGER NOT NULL REFERENCES chauffeurs(id) ON DELETE CASCADE,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          accuracy INTEGER,
          speed DECIMAL(5, 2),
          heading DECIMAL(5, 2),
          timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_positions_gps_chauffeur ON positions_gps(chauffeur_id);
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_positions_gps_timestamp ON positions_gps(timestamp);
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_positions_gps_active ON positions_gps(is_active);
      `);

      console.log('✅ Table positions_gps créée avec succès !');
    } else {
      console.log('✅ Table positions_gps existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors des migrations :', error.message);
    throw error; // Relance l'erreur pour la gestion dans les appels externes
  }
};

// Export du module
module.exports = { runMigrations };
