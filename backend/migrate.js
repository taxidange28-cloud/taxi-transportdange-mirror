const { query, pool } = require('./src/config/database');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting migration...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Add columns if they don't exist (ALTER TABLE is DDL and implicitly commits in some DBs,
    // but PostgreSQL supports transactional DDL)
    await client.query(`
      ALTER TABLE missions 
      ADD COLUMN IF NOT EXISTS client_telephone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS nombre_passagers INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS prix_estime DECIMAL(10,2);
    `);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Migration completed successfully!');
    return { success: true, message: 'Migration completed' };
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

module.exports = { runMigration };
