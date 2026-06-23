-- Migración: catálogo de riesgos (ejecutar en BD existente)
CREATE TABLE IF NOT EXISTS riesgos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) UNIQUE NOT NULL
);

ALTER TABLE riesgos
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE riesgos
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

INSERT INTO riesgos (nombre) VALUES
('Riesgo Químico'),
('Riesgo Biológico')
ON CONFLICT (nombre) DO NOTHING;

SELECT setval('riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM riesgos), 1), false);
