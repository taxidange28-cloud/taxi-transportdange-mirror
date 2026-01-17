const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/db-structure', async (req, res) => {
  try {
    const queries = {
      tables: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `,
      chauffeurs_exists: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'chauffeurs'
        )
      `,
      utilisateurs_structure: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'utilisateurs'
        ORDER BY ordinal_position
      `,
      chauffeurs_structure: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'chauffeurs'
        ORDER BY ordinal_position
      `,
      positions_gps_exists: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'positions_gps'
        )
      `,
      positions_gps_structure: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'positions_gps'
        ORDER BY ordinal_position
      `
    };

    const results = {};

    for (const [key, query] of Object.entries(queries)) {
      try {
        const result = await pool.query(query);
        results[key] = result.rows;
      } catch (err) {
        results[key] = { error: err.message };
      }
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: process.env.DATABASE_URL ? 'Connected' : 'Not configured',
      results
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
