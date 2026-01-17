CREATE TABLE IF NOT EXISTS positions_gps (
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

CREATE INDEX idx_positions_gps_chauffeur ON positions_gps(chauffeur_id);
CREATE INDEX idx_positions_gps_timestamp ON positions_gps(timestamp);
CREATE INDEX idx_positions_gps_active ON positions_gps(is_active);

COMMENT ON TABLE positions_gps IS 'Stockage des positions GPS des chauffeurs en temps réel';
COMMENT ON COLUMN positions_gps.latitude IS 'Latitude (ex: 48.8566)';
COMMENT ON COLUMN positions_gps.longitude IS 'Longitude (ex: 2.3522)';
COMMENT ON COLUMN positions_gps.accuracy IS 'Précision en mètres';
COMMENT ON COLUMN positions_gps.speed IS 'Vitesse en km/h';
COMMENT ON COLUMN positions_gps.heading IS 'Direction en degrés (0-360)';
COMMENT ON COLUMN positions_gps.is_active IS 'true = chauffeur connecté et actif';
