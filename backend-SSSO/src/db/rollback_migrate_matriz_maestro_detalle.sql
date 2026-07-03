BEGIN;

ALTER TABLE planificaciones
  DROP CONSTRAINT IF EXISTS planificaciones_evaluacion_id_fkey;

ALTER TABLE planificaciones
  ADD CONSTRAINT planificaciones_evaluacion_id_fkey
  FOREIGN KEY (evaluacion_id)
  REFERENCES matriz_riesgos(id)
  ON DELETE CASCADE;

DROP INDEX IF EXISTS idx_matriz_evaluacion_detalles_peligro;
DROP INDEX IF EXISTS idx_matriz_evaluacion_detalles_riesgo;
DROP INDEX IF EXISTS idx_matriz_evaluacion_detalles_evaluacion;
DROP INDEX IF EXISTS idx_matriz_evaluaciones_estado;
DROP INDEX IF EXISTS idx_matriz_evaluaciones_fecha;

DROP TABLE IF EXISTS matriz_evaluacion_detalles;
DROP TABLE IF EXISTS matriz_evaluaciones;

COMMIT;
