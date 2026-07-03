BEGIN;

ALTER TABLE matriz_evaluacion_detalles
  DROP CONSTRAINT IF EXISTS matriz_evaluacion_detalles_evaluacion_funcion_id_fkey;

DROP INDEX IF EXISTS idx_matriz_eval_detalles_eval_funcion;
DROP INDEX IF EXISTS idx_matriz_eval_funciones_funcion;
DROP INDEX IF EXISTS idx_matriz_eval_funciones_evaluacion;

ALTER TABLE matriz_evaluacion_detalles
  DROP COLUMN IF EXISTS evaluacion_funcion_id;

DROP TABLE IF EXISTS matriz_evaluacion_funciones;

COMMIT;
