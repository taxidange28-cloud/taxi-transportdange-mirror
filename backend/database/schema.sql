-- Transport DanGE - Schéma de base de données PostgreSQL

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (secrétaire)
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'secretaire',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des chauffeurs
CREATE TABLE chauffeurs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    fcm_token TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des véhicules (optionnel)
CREATE TABLE vehicules (
    id SERIAL PRIMARY KEY,
    immatriculation VARCHAR(20) UNIQUE NOT NULL,
    modele VARCHAR(100),
    chauffeur_id INTEGER REFERENCES chauffeurs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des missions
CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    date_mission DATE NOT NULL,
    heure_prevue TIME NOT NULL,
    client VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'CPAM' ou 'Privé'
    adresse_depart TEXT NOT NULL,
    adresse_arrivee TEXT NOT NULL,
    chauffeur_id INTEGER REFERENCES chauffeurs(id),
    vehicule_id INTEGER REFERENCES vehicules(id),
    notes TEXT,
    client_telephone VARCHAR(20),
    nombre_passagers INTEGER DEFAULT 1,
    prix_estime DECIMAL(10,2),
    statut VARCHAR(20) NOT NULL DEFAULT 'brouillon', -- brouillon, envoyee, confirmee, pec, terminee
    heure_pec TIMESTAMP,
    heure_depose TIMESTAMP,
    duree_minutes INTEGER,
    commentaire_chauffeur TEXT,
    envoyee_le TIMESTAMP,
    confirmee_le TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_missions_date ON missions(date_mission);
CREATE INDEX idx_missions_chauffeur ON missions(chauffeur_id);
CREATE INDEX idx_missions_statut ON missions(statut);
CREATE INDEX idx_missions_date_chauffeur ON missions(date_mission, chauffeur_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chauffeurs_updated_at BEFORE UPDATE ON chauffeurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour calculer automatiquement la durée
CREATE OR REPLACE FUNCTION calculate_mission_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.heure_pec IS NOT NULL AND NEW.heure_depose IS NOT NULL THEN
        NEW.duree_minutes = EXTRACT(EPOCH FROM (NEW.heure_depose - NEW.heure_pec)) / 60;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_duration_trigger BEFORE INSERT OR UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION calculate_mission_duration();

-- Table positions GPS
CREATE TABLE positions_gps (
    id SERIAL PRIMARY KEY,
    chauffeur_id INTEGER REFERENCES chauffeurs(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_positions_chauffeur ON positions_gps(chauffeur_id);
CREATE INDEX idx_positions_timestamp ON positions_gps(timestamp);
