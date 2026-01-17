const bcrypt = require('bcrypt');
const { pool } = require('../src/config/database');

async function createAdmin() {
  try {
    console.log('🔧 Création du compte administrateur...\n');

    // Récupérer le mot de passe depuis les arguments ou l'environnement
    const password = process.argv[2] || process.env.ADMIN_PASSWORD || 'admin77281670';
    
    if (!password || password.length < 8) {
      console.error('❌ Le mot de passe doit contenir au moins 8 caractères');
      await pool.end();
      process.exit(1);
    }

    // Vérifier si un admin existe déjà
    const existingAdmin = await pool.query(
      'SELECT * FROM utilisateurs WHERE username = $1',
      ['admin']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Un compte administrateur existe déjà!');
      console.log('   Username: admin');
      console.log('   Créé le:', existingAdmin.rows[0].created_at);
      console.log('\n💡 Pour réinitialiser le mot de passe, supprimez d\'abord le compte existant.');
      await pool.end();
      process.exit(0);
    }

    // Générer le hash du mot de passe
    console.log('🔐 Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Mot de passe hashé avec succès\n');

    // Créer le compte admin
    console.log('👤 Création du compte administrateur...');
    const result = await pool.query(
      'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      ['admin', hashedPassword, 'admin']
    );

    const admin = result.rows[0];

    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Compte administrateur créé avec succès !');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('📋 Informations du compte:');
    console.log('   ID:', admin.id);
    console.log('   Username: admin');
    console.log('   Password: ********');
    console.log('   Rôle:', admin.role);
    console.log('   Créé le:', admin.created_at);
    console.log('');
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
    console.log('');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte administrateur:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('');
      console.error('💡 Vérifiez que:');
      console.error('   1. PostgreSQL est démarré');
      console.error('   2. Les variables d\'environnement sont correctement configurées');
      console.error('   3. La base de données existe et est accessible');
    }
    await pool.end();
    process.exit(1);
  }
}

// Exécuter la création
createAdmin();
