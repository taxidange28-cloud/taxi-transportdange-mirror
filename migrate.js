const { Pool } = require('pg');

const renderUrl = 'postgresql://transport_dange:1yP4DIhEHILeSy3kU7eQ4CEnpyoXrWmF@dpg-d5am7fv5r7bs739tlmf0-a.frankfurt-postgres.render.com/transport_dange';
const railwayUrl = 'postgresql://postgres:YahLpAYZKCWCbVyRJOivckHktJicFrTx@maglev.proxy.rlwy.net:15212/railway';

const renderPool = new Pool({ connectionString: renderUrl, ssl: { rejectUnauthorized: false } });
const railwayPool = new Pool({ connectionString: railwayUrl, ssl: { rejectUnauthorized: false } });

async function migrate() {
  try {
    console.log('🔄 Début de la migration Render → Railway\n');

    // 1. Dump complet de Render
    console.log('📦 Export des données depuis Render...');
    const tables = await renderPool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);

    for (const { tablename } of tables.rows) {
      console.log(`\n📋 Table: ${tablename}`);
      
      const data = await renderPool.query(`SELECT * FROM ${tablename}`);
      console.log(`   ${data.rows.length} lignes trouvées`);

      if (data.rows.length > 0) {
        const columns = Object.keys(data.rows[0]);
        
        for (const row of data.rows) {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'number' || typeof val === 'boolean') return val;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return `'${String(val).replace(/'/g, "''")}'`;
          });

          await railwayPool.query(`
            INSERT INTO ${tablename} (${columns.join(', ')})
            VALUES (${values.join(', ')})
            ON CONFLICT DO NOTHING
          `);
        }
        console.log(`   ✅ ${data.rows.length} lignes importées dans Railway`);
      }
    }

    console.log('\n✅ Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await renderPool.end();
    await railwayPool.end();
  }
}

migrate();
