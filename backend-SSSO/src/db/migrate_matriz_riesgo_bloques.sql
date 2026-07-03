BEGIN;

ALTER TABLE matriz_riesgos
  ADD COLUMN IF NOT EXISTS acciones TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS recursos TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS fecha_cumplimiento DATE,
  ADD COLUMN IF NOT EXISTS responsable TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT 'pendiente';

-- Backfill desde planificaciones para no perder contexto operativo de evaluaciones previas.
WITH plan_base AS (
  SELECT DISTINCT ON (p.evaluacion_id)
    p.evaluacion_id,
    p.medida,
    p.fecha_cumplimiento,
    p.responsable,
    p.estado
  FROM planificaciones p
  ORDER BY p.evaluacion_id, p.id DESC
)
UPDATE matriz_riesgos mr
SET
  acciones = CASE
    WHEN COALESCE(mr.acciones, '') = '' THEN COALESCE(pb.medida, '')
    ELSE mr.acciones
  END,
  fecha_cumplimiento = COALESCE(mr.fecha_cumplimiento, pb.fecha_cumplimiento),
  responsable = CASE
    WHEN COALESCE(mr.responsable, '') = '' THEN COALESCE(pb.responsable, '')
    ELSE mr.responsable
  END,
  estado = CASE
    WHEN COALESCE(mr.estado, '') = '' THEN COALESCE(pb.estado, 'pendiente')
    ELSE mr.estado
  END
FROM plan_base pb
WHERE pb.evaluacion_id = mr.id;

UPDATE matriz_riesgos
SET
  acciones = COALESCE(acciones, ''),
  recursos = COALESCE(recursos, ''),
  responsable = COALESCE(responsable, ''),
  estado = COALESCE(NULLIF(estado, ''), 'pendiente');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_estado_check'
  ) THEN
    ALTER TABLE matriz_riesgos
      ADD CONSTRAINT matriz_riesgos_estado_check
      CHECK (estado IN ('pendiente', 'en proceso', 'completado'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_medidas_prev_max_len'
  ) THEN
    ALTER TABLE matriz_riesgos
      ADD CONSTRAINT matriz_riesgos_medidas_prev_max_len CHECK (char_length(medidas_prev) <= 2000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_acciones_max_len'
  ) THEN
    ALTER TABLE matriz_riesgos
      ADD CONSTRAINT matriz_riesgos_acciones_max_len CHECK (char_length(acciones) <= 2000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_recursos_max_len'
  ) THEN
    ALTER TABLE matriz_riesgos
      ADD CONSTRAINT matriz_riesgos_recursos_max_len CHECK (char_length(recursos) <= 2000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matriz_riesgos_responsable_max_len'
  ) THEN
    ALTER TABLE matriz_riesgos
      ADD CONSTRAINT matriz_riesgos_responsable_max_len CHECK (char_length(responsable) <= 2000);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_matriz_riesgos_estado ON matriz_riesgos(estado);
CREATE INDEX IF NOT EXISTS idx_matriz_riesgos_fecha_cumplimiento ON matriz_riesgos(fecha_cumplimiento);

COMMIT;
