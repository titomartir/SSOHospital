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
-- Se insertan directamente con servicio_id para respetar la relacion Puesto -> Servicio.

INSERT INTO puestos (nombre, servicio_id)
SELECT 'Enfermero/a', s.id
FROM servicios s
WHERE s.nombre = 'Triage'
  AND NOT EXISTS (
    SELECT 1
    FROM puestos p
    WHERE p.nombre = 'Enfermero/a'
      AND p.servicio_id = s.id
  );

INSERT INTO puestos (nombre, servicio_id)
SELECT 'Médico intensivista', s.id
FROM servicios s
WHERE s.nombre = 'Cuidados críticos'
  AND NOT EXISTS (
    SELECT 1
    FROM puestos p
    WHERE p.nombre = 'Médico intensivista'
      AND p.servicio_id = s.id
  );

INSERT INTO puestos (nombre, servicio_id)
SELECT 'Técnico de laboratorio', s.id
FROM servicios s
WHERE s.nombre = 'Procesamiento de muestras'
  AND NOT EXISTS (
    SELECT 1
    FROM puestos p
    WHERE p.nombre = 'Técnico de laboratorio'
      AND p.servicio_id = s.id
  );

INSERT INTO puestos (nombre, servicio_id)
SELECT 'Técnico eléctrico', s.id
FROM servicios s
WHERE s.nombre = 'Mantenimiento eléctrico'
  AND NOT EXISTS (
    SELECT 1
    FROM puestos p
    WHERE p.nombre = 'Técnico eléctrico'
      AND p.servicio_id = s.id
  );

-- Salvaguarda para datos preexistentes: asignar primer servicio disponible a puestos sin servicio
UPDATE puestos
SET servicio_id = (SELECT id FROM servicios ORDER BY id LIMIT 1)
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

-- Semillas de funciones asociadas al puesto correcto dentro de su servicio
INSERT INTO funciones (nombre, puesto_id)
SELECT 'Atención directa a pacientes', p.id
FROM puestos p
INNER JOIN servicios s ON s.id = p.servicio_id
WHERE p.nombre = 'Enfermero/a'
  AND s.nombre = 'Triage'
ON CONFLICT (puesto_id, nombre) DO NOTHING;

INSERT INTO funciones (nombre, puesto_id)
SELECT 'Procedimientos invasivos', p.id
FROM puestos p
INNER JOIN servicios s ON s.id = p.servicio_id
WHERE p.nombre = 'Médico intensivista'
  AND s.nombre = 'Cuidados críticos'
ON CONFLICT (puesto_id, nombre) DO NOTHING;

INSERT INTO funciones (nombre, puesto_id)
SELECT 'Procesamiento de muestras biológicas', p.id
FROM puestos p
INNER JOIN servicios s ON s.id = p.servicio_id
WHERE p.nombre = 'Técnico de laboratorio'
  AND s.nombre = 'Procesamiento de muestras'
ON CONFLICT (puesto_id, nombre) DO NOTHING;

INSERT INTO funciones (nombre, puesto_id)
SELECT 'Inspección de instalaciones', p.id
FROM puestos p
INNER JOIN servicios s ON s.id = p.servicio_id
WHERE p.nombre = 'Técnico eléctrico'
  AND s.nombre = 'Mantenimiento eléctrico'
ON CONFLICT (puesto_id, nombre) DO NOTHING;

SELECT setval('puestos_id_seq', COALESCE((SELECT MAX(id)+1 FROM puestos), 1), false);
SELECT setval('funciones_id_seq', COALESCE((SELECT MAX(id)+1 FROM funciones), 1), false);
