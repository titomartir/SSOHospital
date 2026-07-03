BEGIN;

CREATE TABLE IF NOT EXISTS matriz_riesgos_bloques_backup (
  matriz_riesgo_id INT PRIMARY KEY,
  acciones TEXT,
  recursos TEXT,
  fecha_cumplimiento DATE,
  responsable TEXT,
  estado VARCHAR(20),
  backed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO matriz_riesgos_bloques_backup (
  matriz_riesgo_id,
  acciones,
  recursos,
  fecha_cumplimiento,
  responsable,
  estado
)
SELECT
  mr.id,
  mr.acciones,
  mr.recursos,
  mr.fecha_cumplimiento,
  mr.responsable,
  mr.estado
FROM matriz_riesgos mr
ON CONFLICT (matriz_riesgo_id) DO UPDATE
SET
  acciones = EXCLUDED.acciones,
  recursos = EXCLUDED.recursos,
  fecha_cumplimiento = EXCLUDED.fecha_cumplimiento,
  responsable = EXCLUDED.responsable,
  estado = EXCLUDED.estado,
  backed_up_at = NOW();

DROP INDEX IF EXISTS idx_matriz_riesgos_estado;
DROP INDEX IF EXISTS idx_matriz_riesgos_fecha_cumplimiento;

ALTER TABLE matriz_riesgos
  DROP CONSTRAINT IF EXISTS matriz_riesgos_estado_check,
  DROP CONSTRAINT IF EXISTS matriz_riesgos_acciones_max_len,
  DROP CONSTRAINT IF EXISTS matriz_riesgos_recursos_max_len,
  DROP CONSTRAINT IF EXISTS matriz_riesgos_responsable_max_len;

ALTER TABLE matriz_riesgos
  DROP COLUMN IF EXISTS acciones,
  DROP COLUMN IF EXISTS recursos,
  DROP COLUMN IF EXISTS fecha_cumplimiento,
  DROP COLUMN IF EXISTS responsable,
  DROP COLUMN IF EXISTS estado;

COMMIT;
