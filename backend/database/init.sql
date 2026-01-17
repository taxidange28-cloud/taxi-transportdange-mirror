-- Transport DanGE - Initialisation complète
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CRÉATION DES TABLES
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'secretaire',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chauffeurs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    fcm_token TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicules (
    id SERIAL PRIMARY KEY,
    immatriculation VARCHAR(20) UNIQUE NOT NULL,
    modele VARCHAR(100),
    chauffeur_id INTEGER REFERENCES chauffeurs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS missions (
    id SERIAL PRIMARY KEY,
    date_mission DATE NOT NULL,
    heure_prevue TIME NOT NULL,
    client VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    adresse_depart TEXT NOT NULL,
    adresse_arrivee TEXT NOT NULL,
    chauffeur_id INTEGER REFERENCES chauffeurs(id),
    vehicule_id INTEGER REFERENCES vehicules(id),
    notes TEXT,
    client_telephone VARCHAR(20),
    nombre_passagers INTEGER DEFAULT 1,
    prix_estime DECIMAL(10,2),
    statut VARCHAR(20) NOT NULL DEFAULT 'brouillon',
    heure_pec TIMESTAMP,
    heure_depose TIMESTAMP,
    duree_minutes INTEGER,
    commentaire_chauffeur TEXT,
    envoyee_le TIMESTAMP,
    confirmee_le TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS positions_gps (
    id SERIAL PRIMARY KEY,
    chauffeur_id INTEGER REFERENCES chauffeurs(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_missions_date ON missions(date_mission);
CREATE INDEX IF NOT EXISTS idx_missions_chauffeur ON missions(chauffeur_id);
CREATE INDEX IF NOT EXISTS idx_missions_statut ON missions(statut);
CREATE INDEX IF NOT EXISTS idx_positions_chauffeur ON positions_gps(chauffeur_id);

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chauffeurs_updated_at BEFORE UPDATE ON chauffeurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DONNÉES INITIALES
INSERT INTO utilisateurs (username, password, role) VALUES
('Secretaire', '$2b$10$PLACEHOLDER', 'secretaire')
ON CONFLICT (username) DO NOTHING;

INSERT INTO chauffeurs (username, password, nom) VALUES
('patron', '$2b$10$PLACEHOLDER', 'Patron'),
('franck', '$2b$10$PLACEHOLDER', 'Franck'),
('laurence', '$2b$10$PLACEHOLDER', 'Laurence'),
('autre', '$2b$10$PLACEHOLDER', 'Autre')
ON CONFLICT (username) DO NOTHING;

INSERT INTO vehicules (immatriculation, modele, chauffeur_id) VALUES
('AA-123-BB', 'Peugeot 508', 1),
('CC-456-DD', 'Renault Talisman', 2),
('EE-789-FF', 'Citroën C5', 3),
('GG-012-HH', 'Skoda Superb', 4)
ON CONFLICT (immatriculation) DO NOTHING;
