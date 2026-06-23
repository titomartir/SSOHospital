-- Migración: catálogo de peligros (ejecutar en BD existente)
CREATE TABLE IF NOT EXISTS peligros (
    id SERIAL PRIMARY KEY,
        nombre VARCHAR(200) UNIQUE NOT NULL
);

ALTER TABLE peligros
ADD COLUMN IF NOT EXISTS riesgo_id INT;

ALTER TABLE peligros
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE peligros
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

INSERT INTO riesgos (nombre) VALUES ('Riesgo General')
ON CONFLICT (nombre) DO NOTHING;

UPDATE peligros
SET riesgo_id = (SELECT id FROM riesgos WHERE nombre = 'Riesgo General')
WHERE riesgo_id IS NULL;

ALTER TABLE peligros
ALTER COLUMN riesgo_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'peligros_riesgo_id_fkey'
    ) THEN
        ALTER TABLE peligros
        ADD CONSTRAINT peligros_riesgo_id_fkey
        FOREIGN KEY (riesgo_id)
        REFERENCES riesgos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT;
    END IF;
END $$;

INSERT INTO peligros (nombre, riesgo_id) VALUES
('Cancerigenos/Mutagenicos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Corrosivos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Irritantes', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Sensibilizantes', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Toxicos/Asfixiantes', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Virus', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico')),
('Bacterias', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico')),
('Hongos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico')),
('Parásitos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico'))
ON CONFLICT (nombre) DO NOTHING;

SELECT setval('peligros_id_seq', COALESCE((SELECT MAX(id)+1 FROM peligros), 1), false);
