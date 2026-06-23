-- Migración: jerarquía Riesgo -> Peligro

CREATE TABLE IF NOT EXISTS riesgos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) UNIQUE NOT NULL
);

ALTER TABLE riesgos
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE riesgos
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

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

SELECT setval('riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM riesgos), 1), false);
SELECT setval('peligros_id_seq', COALESCE((SELECT MAX(id)+1 FROM peligros), 1), false);
