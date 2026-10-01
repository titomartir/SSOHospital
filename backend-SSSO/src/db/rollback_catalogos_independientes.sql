BEGIN;

ALTER TABLE matriz_evaluacion_detalles
  DROP CONSTRAINT IF EXISTS matriz_eval_detalles_medida_preventiva_id_fkey,
  DROP CONSTRAINT IF EXISTS matriz_eval_detalles_accion_id_fkey,
  DROP CONSTRAINT IF EXISTS matriz_eval_detalles_recurso_id_fkey,
  DROP CONSTRAINT IF EXISTS matriz_eval_detalles_responsable_id_fkey;

DROP INDEX IF EXISTS idx_matriz_eval_detalles_responsable_id;
DROP INDEX IF EXISTS idx_matriz_eval_detalles_recurso_id;
DROP INDEX IF EXISTS idx_matriz_eval_detalles_accion_id;
DROP INDEX IF EXISTS idx_matriz_eval_detalles_medida_preventiva_id;

ALTER TABLE matriz_evaluacion_detalles
  DROP COLUMN IF EXISTS responsable_id,
  DROP COLUMN IF EXISTS recurso_id,
  DROP COLUMN IF EXISTS accion_id,
  DROP COLUMN IF EXISTS medida_preventiva_id;

DROP TABLE IF EXISTS responsables;
DROP TABLE IF EXISTS recursos;
DROP TABLE IF EXISTS acciones;
DROP TABLE IF EXISTS medidas_preventivas;

COMMIT;
