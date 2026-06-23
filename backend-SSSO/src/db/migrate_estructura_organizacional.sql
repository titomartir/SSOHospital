-- Migración: estructura jerárquica Sub Dirección -> Departamento -> Servicio

CREATE TABLE IF NOT EXISTS sub_direcciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO sub_direcciones (nombre) VALUES
('Servicios Generales'),
('Recursos Humanos'),
('Administrativo - Financiera'),
('Médica'),
('Enfermería'),
('Técnica')
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE departamentos
ADD COLUMN IF NOT EXISTS sub_direccion_id INT;

UPDATE departamentos
SET sub_direccion_id = (SELECT id FROM sub_direcciones WHERE nombre = 'Médica')
WHERE sub_direccion_id IS NULL;

ALTER TABLE departamentos
ALTER COLUMN sub_direccion_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'departamentos_sub_direccion_id_fkey'
  ) THEN
    ALTER TABLE departamentos
    ADD CONSTRAINT departamentos_sub_direccion_id_fkey
    FOREIGN KEY (sub_direccion_id)
    REFERENCES sub_direcciones(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    departamento_id INT NOT NULL REFERENCES departamentos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (departamento_id, nombre)
);

INSERT INTO servicios (nombre, departamento_id)
SELECT 'Servicio General', d.id
FROM departamentos d
WHERE NOT EXISTS (
  SELECT 1 FROM servicios s WHERE s.departamento_id = d.id
);

SELECT setval('sub_direcciones_id_seq', COALESCE((SELECT MAX(id)+1 FROM sub_direcciones), 1), false);
SELECT setval('servicios_id_seq', COALESCE((SELECT MAX(id)+1 FROM servicios), 1), false);
