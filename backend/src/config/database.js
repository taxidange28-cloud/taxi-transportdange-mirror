const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool PostgreSQL
// Priorité à DATABASE_URL (Render/Production) sinon variables individuelles (local)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        // SSL requis pour Render - rejectUnauthorized: false nécessaire car Render utilise des certificats auto-signés
        ssl: {
          rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'transport_dange',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à la base de données PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion PostgreSQL:', err);
  process.exit(-1);
});

// Fonction helper pour les requêtes
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🗄️ Query executed', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('🗄️ Database query error:', {
      text: text.substring(0, 100),
      error: error.message,
      code: error.code,
      detail: error.detail
    });
    throw error;
  }
};

module.exports = {
  pool,
  query,
};
