-- Migración: catálogo de riesgos (ejecutar en BD existente)
CREATE TABLE IF NOT EXISTS riesgos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) UNIQUE NOT NULL
);

INSERT INTO riesgos (nombre) VALUES
('Contagio de VIH, Hepatitis B y C'),
('Infecciones respiratorias ocupacionales'),
('Irritación dérmica y respiratoria'),
('Descarga eléctrica')
ON CONFLICT (nombre) DO NOTHING;

SELECT setval('riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM riesgos), 1), false);
