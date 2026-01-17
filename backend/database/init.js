const bcrypt = require('bcrypt');
const { pool } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔧 Initialisation de la base de données...\n');

    // Lire le schéma SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
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

    // Insérer les chauffeurs
    console.log('👥 Insertion des chauffeurs...');
    const chauffeurs = [
      { username: 'patron', nom: 'Patron' },
      { username: 'franck', nom: 'Franck' },
      { username: 'laurence', nom: 'Laurence' },
      { username: 'autre', nom: 'Autre' },
    ];

    for (const chauffeur of chauffeurs) {
      await pool.query(
        'INSERT INTO chauffeurs (username, password, nom) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
        [chauffeur.username, hashedPassword, chauffeur.nom]
      );
      console.log(`✅ Chauffeur créé: ${chauffeur.username} / ChangezMoi123!`);
    }
    console.log('');

    // Insérer des véhicules d'exemple
    console.log('🚗 Insertion des véhicules...');
    const vehicules = [
      { immatriculation: 'AA-123-BB', modele: 'Peugeot 508', chauffeur_id: 1 },
      { immatriculation: 'CC-456-DD', modele: 'Renault Talisman', chauffeur_id: 2 },
      { immatriculation: 'EE-789-FF', modele: 'Citroën C5', chauffeur_id: 3 },
      { immatriculation: 'GG-012-HH', modele: 'Skoda Superb', chauffeur_id: 4 },
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
    console.log('  Secrétaire: Secretaire / ChangezMoi123!');
    console.log('  Chauffeurs: patron, franck, laurence, autre / ChangezMoi123!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initializeDatabase();
