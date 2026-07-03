BEGIN;

CREATE TABLE IF NOT EXISTS matriz_evaluacion_funciones (
  id SERIAL PRIMARY KEY,
  evaluacion_id INT NOT NULL REFERENCES matriz_evaluaciones(id) ON UPDATE CASCADE ON DELETE CASCADE,
  funcion_id INT REFERENCES funciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  orden INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matriz_eval_funciones_evaluacion ON matriz_evaluacion_funciones(evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_matriz_eval_funciones_funcion ON matriz_evaluacion_funciones(funcion_id);

ALTER TABLE matriz_evaluacion_detalles
  ADD COLUMN IF NOT EXISTS evaluacion_funcion_id INT;

INSERT INTO matriz_evaluacion_funciones (evaluacion_id, funcion_id, orden)
SELECT e.id, e.funcion_id, 1
FROM matriz_evaluaciones e
WHERE NOT EXISTS (
  SELECT 1
  FROM matriz_evaluacion_funciones ef
  WHERE ef.evaluacion_id = e.id
);

UPDATE matriz_evaluacion_detalles d
SET evaluacion_funcion_id = ef.id
FROM matriz_evaluacion_funciones ef
WHERE ef.evaluacion_id = d.evaluacion_id
  AND d.evaluacion_funcion_id IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'matriz_evaluacion_detalles'
      AND column_name = 'evaluacion_funcion_id'
      AND is_nullable = 'YES'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM matriz_evaluacion_detalles
    WHERE evaluacion_funcion_id IS NULL
  ) THEN
    ALTER TABLE matriz_evaluacion_detalles
      ALTER COLUMN evaluacion_funcion_id SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'matriz_evaluacion_detalles_evaluacion_funcion_id_fkey'
  ) THEN
    ALTER TABLE matriz_evaluacion_detalles
      ADD CONSTRAINT matriz_evaluacion_detalles_evaluacion_funcion_id_fkey
      FOREIGN KEY (evaluacion_funcion_id)
      REFERENCES matriz_evaluacion_funciones(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_matriz_eval_detalles_eval_funcion ON matriz_evaluacion_detalles(evaluacion_funcion_id);

COMMIT;
