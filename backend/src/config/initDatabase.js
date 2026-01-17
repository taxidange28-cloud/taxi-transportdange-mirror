const bcrypt = require('bcrypt');
const { pool } = require('./database');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    console.log('🔧 Initialisation de la base de données...\n');

    // Lire le schéma SQL
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Exécuter le schéma
    console.log('📝 Création des tables...');
    await pool.query(schema);
    console.log('✅ Tables créées\n');

    // Générer le hash du mot de passe
    const password = 'ChangezMoi123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Mot de passe hashé généré\n');

    // Insérer la secrétaire
    console.log('👤 Insertion de la secrétaire...');
    await pool.query(
      'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      ['Secretaire', hashedPassword, 'secretaire']
    );
    console.log('✅ Secrétaire créée: Secretaire / ChangezMoi123!\n');

    // Insérer l'admin
    console.log('👨‍💼 Insertion de l\'admin...');
    const adminPassword = 'Admin2026Secure!';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      ['admin', hashedAdminPassword, 'admin']
    );
    console.log('✅ Admin créé: admin / Admin2026Secure!\n');

    // Insérer les chauffeurs
    console.log('👥 Insertion des chauffeurs...');
    const chauffeurs = [
      { username: 'patron', nom: 'Patron' },
      { username: 'franck', nom: 'Franck' },
      { username: 'laurence', nom: 'Laurence' },
      { username: 'autre', nom: 'Autre' },
    ];

    const chauffeurIds = [];
    for (const chauffeur of chauffeurs) {
      const result = await pool.query(
        'INSERT INTO chauffeurs (username, password, nom) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, nom = EXCLUDED.nom RETURNING id',
        [chauffeur.username, hashedPassword, chauffeur.nom]
      );
      if (result.rows && result.rows.length > 0) {
        chauffeurIds.push(result.rows[0].id);
        console.log(`✅ Chauffeur créé: ${chauffeur.username} / ChangezMoi123!`);
      }
    }
    console.log('');

    // Insérer des véhicules d'exemple
    console.log('🚗 Insertion des véhicules...');
    const vehicules = [
      { immatriculation: 'AA-123-BB', modele: 'Peugeot 508', chauffeur_id: chauffeurIds[0] },
      { immatriculation: 'CC-456-DD', modele: 'Renault Talisman', chauffeur_id: chauffeurIds[1] },
      { immatriculation: 'EE-789-FF', modele: 'Citroën C5', chauffeur_id: chauffeurIds[2] },
      { immatriculation: 'GG-012-HH', modele: 'Skoda Superb', chauffeur_id: chauffeurIds[3] },
    ];

    for (const vehicule of vehicules) {
      await pool.query(
        'INSERT INTO vehicules (immatriculation, modele, chauffeur_id) VALUES ($1, $2, $3) ON CONFLICT (immatriculation) DO NOTHING',
        [vehicule.immatriculation, vehicule.modele, vehicule.chauffeur_id]
      );
      console.log(`✅ Véhicule ajouté: ${vehicule.immatriculation} - ${vehicule.modele}`);
    }
    console.log('');

    console.log('═══════════════════════════════════════════════');
    console.log('✅ Base de données initialisée avec succès !');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('📋 Comptes créés:');
    console.log('  Admin: admin / Admin2026Secure!');
    console.log('  Secrétaire: Secretaire / ChangezMoi123!');
    console.log('  Chauffeurs: patron, franck, laurence, autre / ChangezMoi123!');
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

module.exports = { initDatabase };
