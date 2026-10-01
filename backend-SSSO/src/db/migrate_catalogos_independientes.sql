BEGIN;

CREATE TABLE IF NOT EXISTS medidas_preventivas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS acciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS responsables (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE matriz_evaluacion_detalles
  ADD COLUMN IF NOT EXISTS medida_preventiva_id INT,
  ADD COLUMN IF NOT EXISTS accion_id INT,
  ADD COLUMN IF NOT EXISTS recurso_id INT,
  ADD COLUMN IF NOT EXISTS responsable_id INT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_eval_detalles_medida_preventiva_id_fkey'
  ) THEN
    ALTER TABLE matriz_evaluacion_detalles
      ADD CONSTRAINT matriz_eval_detalles_medida_preventiva_id_fkey
      FOREIGN KEY (medida_preventiva_id)
      REFERENCES medidas_preventivas(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_eval_detalles_accion_id_fkey'
  ) THEN
    ALTER TABLE matriz_evaluacion_detalles
      ADD CONSTRAINT matriz_eval_detalles_accion_id_fkey
      FOREIGN KEY (accion_id)
      REFERENCES acciones(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_eval_detalles_recurso_id_fkey'
  ) THEN
    ALTER TABLE matriz_evaluacion_detalles
      ADD CONSTRAINT matriz_eval_detalles_recurso_id_fkey
      FOREIGN KEY (recurso_id)
      REFERENCES recursos(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_eval_detalles_responsable_id_fkey'
  ) THEN
    ALTER TABLE matriz_evaluacion_detalles
      ADD CONSTRAINT matriz_eval_detalles_responsable_id_fkey
      FOREIGN KEY (responsable_id)
      REFERENCES responsables(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_matriz_eval_detalles_medida_preventiva_id
  ON matriz_evaluacion_detalles(medida_preventiva_id);

CREATE INDEX IF NOT EXISTS idx_matriz_eval_detalles_accion_id
  ON matriz_evaluacion_detalles(accion_id);

CREATE INDEX IF NOT EXISTS idx_matriz_eval_detalles_recurso_id
  ON matriz_evaluacion_detalles(recurso_id);

CREATE INDEX IF NOT EXISTS idx_matriz_eval_detalles_responsable_id
  ON matriz_evaluacion_detalles(responsable_id);

COMMIT;
