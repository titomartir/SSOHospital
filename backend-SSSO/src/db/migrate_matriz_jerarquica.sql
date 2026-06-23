-- Migración: matriz_riesgos con relaciones jerárquicas y sin actividad

ALTER TABLE matriz_riesgos
ADD COLUMN IF NOT EXISTS sub_direccion_id INT,
ADD COLUMN IF NOT EXISTS departamento_id INT,
ADD COLUMN IF NOT EXISTS servicio_id INT,
ADD COLUMN IF NOT EXISTS riesgo_id INT,
ADD COLUMN IF NOT EXISTS peligro_id INT;

UPDATE matriz_riesgos mr
SET departamento_id = d.id
FROM departamentos d
WHERE mr.departamento_id IS NULL
  AND mr.departamento = d.nombre;

UPDATE matriz_riesgos mr
SET sub_direccion_id = d.sub_direccion_id
FROM departamentos d
WHERE mr.sub_direccion_id IS NULL
  AND mr.departamento_id = d.id;

UPDATE matriz_riesgos mr
SET servicio_id = s.id
FROM servicios s
WHERE mr.servicio_id IS NULL
  AND s.departamento_id = mr.departamento_id;

UPDATE matriz_riesgos mr
SET riesgo_id = r.id
FROM riesgos r
WHERE mr.riesgo_id IS NULL
  AND mr.riesgo = r.nombre;

UPDATE matriz_riesgos mr
SET peligro_id = p.id
FROM peligros p
WHERE mr.peligro_id IS NULL
  AND mr.peligro = p.nombre;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_sub_direccion_id_fkey'
  ) THEN
    ALTER TABLE matriz_riesgos
    ADD CONSTRAINT matriz_riesgos_sub_direccion_id_fkey
    FOREIGN KEY (sub_direccion_id)
    REFERENCES sub_direcciones(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_departamento_id_fkey'
  ) THEN
    ALTER TABLE matriz_riesgos
    ADD CONSTRAINT matriz_riesgos_departamento_id_fkey
    FOREIGN KEY (departamento_id)
    REFERENCES departamentos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_servicio_id_fkey'
  ) THEN
    ALTER TABLE matriz_riesgos
    ADD CONSTRAINT matriz_riesgos_servicio_id_fkey
    FOREIGN KEY (servicio_id)
    REFERENCES servicios(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_riesgo_id_fkey'
  ) THEN
    ALTER TABLE matriz_riesgos
    ADD CONSTRAINT matriz_riesgos_riesgo_id_fkey
    FOREIGN KEY (riesgo_id)
    REFERENCES riesgos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_peligro_id_fkey'
  ) THEN
    ALTER TABLE matriz_riesgos
    ADD CONSTRAINT matriz_riesgos_peligro_id_fkey
    FOREIGN KEY (peligro_id)
    REFERENCES peligros(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
  END IF;
END $$;

ALTER TABLE matriz_riesgos
ALTER COLUMN sub_direccion_id DROP NOT NULL,
ALTER COLUMN departamento_id DROP NOT NULL,
ALTER COLUMN servicio_id DROP NOT NULL,
ALTER COLUMN riesgo_id DROP NOT NULL,
ALTER COLUMN peligro_id DROP NOT NULL,
ALTER COLUMN puesto DROP NOT NULL;

ALTER TABLE matriz_riesgos
DROP COLUMN IF EXISTS actividad;

ALTER TABLE matriz_riesgos
DROP COLUMN IF EXISTS departamento;

ALTER TABLE matriz_riesgos
DROP COLUMN IF EXISTS riesgo;

ALTER TABLE matriz_riesgos
DROP COLUMN IF EXISTS peligro;
