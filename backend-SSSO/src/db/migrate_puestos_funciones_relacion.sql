-- Migración: jerarquía Puesto -> Función con FK a Servicio
-- Sub Dirección → Departamento → Servicio → Puesto → Función

CREATE TABLE IF NOT EXISTS puestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE puestos ADD COLUMN IF NOT EXISTS servicio_id INT;

CREATE TABLE IF NOT EXISTS funciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    puesto_id INT NOT NULL REFERENCES puestos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (puesto_id, nombre)
);

-- Semillas de puestos con servicio
INSERT INTO puestos (nombre) VALUES
('Enfermero/a'),
('Médico intensivista'),
('Técnico de laboratorio'),
('Técnico eléctrico')
ON CONFLICT DO NOTHING;

-- Asignar servicio a cada puesto
UPDATE puestos SET servicio_id = (SELECT id FROM servicios WHERE nombre = 'Triage')
WHERE nombre = 'Enfermero/a' AND servicio_id IS NULL;

UPDATE puestos SET servicio_id = (SELECT id FROM servicios WHERE nombre = 'Cuidados críticos')
WHERE nombre = 'Médico intensivista' AND servicio_id IS NULL;

UPDATE puestos SET servicio_id = (SELECT id FROM servicios WHERE nombre = 'Procesamiento de muestras')
WHERE nombre = 'Técnico de laboratorio' AND servicio_id IS NULL;

UPDATE puestos SET servicio_id = (SELECT id FROM servicios WHERE nombre = 'Mantenimiento eléctrico')
WHERE nombre = 'Técnico eléctrico' AND servicio_id IS NULL;

-- Salvaguarda: asignar primer servicio disponible a puestos sin servicio
UPDATE puestos SET servicio_id = (SELECT id FROM servicios ORDER BY id LIMIT 1)
WHERE servicio_id IS NULL;

ALTER TABLE puestos ALTER COLUMN servicio_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'puestos_servicio_id_fkey'
  ) THEN
    ALTER TABLE puestos
    ADD CONSTRAINT puestos_servicio_id_fkey
    FOREIGN KEY (servicio_id)
    REFERENCES servicios(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;
END $$;

ALTER TABLE puestos DROP CONSTRAINT IF EXISTS puestos_nombre_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'puestos_servicio_id_nombre_key'
  ) THEN
    ALTER TABLE puestos ADD UNIQUE (servicio_id, nombre);
  END IF;
END $$;

INSERT INTO funciones (nombre, puesto_id) VALUES
('Atención directa a pacientes', (SELECT id FROM puestos WHERE nombre = 'Enfermero/a')),
('Procedimientos invasivos', (SELECT id FROM puestos WHERE nombre = 'Médico intensivista')),
('Procesamiento de muestras biológicas', (SELECT id FROM puestos WHERE nombre = 'Técnico de laboratorio')),
('Inspección de instalaciones', (SELECT id FROM puestos WHERE nombre = 'Técnico eléctrico'))
ON CONFLICT (puesto_id, nombre) DO NOTHING;

SELECT setval('puestos_id_seq', COALESCE((SELECT MAX(id)+1 FROM puestos), 1), false);
SELECT setval('funciones_id_seq', COALESCE((SELECT MAX(id)+1 FROM funciones), 1), false);
