BEGIN;

DROP INDEX IF EXISTS idx_matriz_detalle_responsables_responsable_id;
DROP INDEX IF EXISTS idx_matriz_detalle_recursos_recurso_id;
DROP INDEX IF EXISTS idx_peligro_medida_accion_resp_responsable_id;
DROP INDEX IF EXISTS idx_peligro_medida_accion_recursos_recurso_id;
DROP INDEX IF EXISTS idx_peligro_medida_acciones_accion_id;
DROP INDEX IF EXISTS idx_peligro_medidas_medida_preventiva_id;
DROP INDEX IF EXISTS idx_matriz_detalle_resp_principal;
DROP INDEX IF EXISTS idx_peligro_medida_accion_resp_principal;

DROP TABLE IF EXISTS matriz_detalle_responsables;
DROP TABLE IF EXISTS matriz_detalle_recursos;

ALTER TABLE matriz_evaluacion_detalles
  DROP CONSTRAINT IF EXISTS matriz_evaluacion_detalles_peligro_medida_accion_id_fkey;

DROP INDEX IF EXISTS idx_matriz_eval_detalles_peligro_medida_accion;

ALTER TABLE matriz_evaluacion_detalles
  DROP COLUMN IF EXISTS peligro_medida_accion_id;

DROP TABLE IF EXISTS peligro_medida_accion_responsables;
DROP TABLE IF EXISTS peligro_medida_accion_recursos;
DROP TABLE IF EXISTS peligro_medida_acciones;
DROP TABLE IF EXISTS peligro_medidas;

COMMIT;
