-- Migration: Add client_telephone, nombre_passagers, prix_estime to missions table
-- Date: 2026-01-02

ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS client_telephone VARCHAR(20),
ADD COLUMN IF NOT EXISTS nombre_passagers INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS prix_estime DECIMAL(10,2);

-- Update existing missions to have default values
UPDATE missions 
SET nombre_passagers = 1 
WHERE nombre_passagers IS NULL;
