BEGIN;

CREATE TABLE IF NOT EXISTS matriz_evaluaciones (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  sub_direccion_id INT NOT NULL REFERENCES sub_direcciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  departamento_id INT NOT NULL REFERENCES departamentos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  servicio_id INT NOT NULL REFERENCES servicios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  puesto_id INT REFERENCES puestos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  funcion_id INT REFERENCES funciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ubicacion VARCHAR(150) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en proceso', 'completado')),
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matriz_evaluacion_detalles (
  id SERIAL PRIMARY KEY,
  evaluacion_id INT NOT NULL REFERENCES matriz_evaluaciones(id) ON UPDATE CASCADE ON DELETE CASCADE,
  riesgo_id INT NOT NULL REFERENCES riesgos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  peligro_id INT NOT NULL REFERENCES peligros(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  probabilidad INT NOT NULL CHECK (probabilidad BETWEEN 1 AND 5),
  consecuencia INT NOT NULL CHECK (consecuencia BETWEEN 1 AND 5),
  nivel INT NOT NULL,
  clasificacion VARCHAR(20) NOT NULL,
  medidas_prev TEXT NOT NULL DEFAULT '',
  acciones TEXT NOT NULL DEFAULT '',
  recursos TEXT NOT NULL DEFAULT '',
  fecha_cumplimiento DATE,
  responsable TEXT NOT NULL DEFAULT '',
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en proceso', 'completado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matriz_evaluaciones_fecha ON matriz_evaluaciones(fecha);
CREATE INDEX IF NOT EXISTS idx_matriz_evaluaciones_estado ON matriz_evaluaciones(estado);
CREATE INDEX IF NOT EXISTS idx_matriz_evaluacion_detalles_evaluacion ON matriz_evaluacion_detalles(evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_matriz_evaluacion_detalles_riesgo ON matriz_evaluacion_detalles(riesgo_id);
CREATE INDEX IF NOT EXISTS idx_matriz_evaluacion_detalles_peligro ON matriz_evaluacion_detalles(peligro_id);

CREATE TEMP TABLE tmp_matriz_evaluacion_map (
  fecha DATE,
  sub_direccion_id INT,
  departamento_id INT,
  servicio_id INT,
  puesto_id INT,
  funcion_id INT,
  ubicacion VARCHAR(150),
  estado VARCHAR(20),
  observaciones TEXT,
  evaluacion_id INT
) ON COMMIT DROP;

WITH evaluaciones_agrupadas AS (
  SELECT DISTINCT ON (
    mr.fecha,
    mr.sub_direccion_id,
    mr.departamento_id,
    mr.servicio_id,
    mr.puesto_id,
    mr.funcion_id,
    mr.ubicacion,
    COALESCE(mr.estado, 'pendiente'),
    COALESCE(mr.observaciones, '')
  )
    mr.fecha,
    mr.sub_direccion_id,
    mr.departamento_id,
    mr.servicio_id,
    mr.puesto_id,
    mr.funcion_id,
    mr.ubicacion,
    COALESCE(mr.estado, 'pendiente') AS estado,
    COALESCE(mr.observaciones, '') AS observaciones
  FROM matriz_riesgos mr
  ORDER BY
    mr.fecha,
    mr.sub_direccion_id,
    mr.departamento_id,
    mr.servicio_id,
    mr.puesto_id,
    mr.funcion_id,
    mr.ubicacion,
    COALESCE(mr.estado, 'pendiente'),
    COALESCE(mr.observaciones, ''),
    mr.id
), inserted_evaluaciones AS (
  INSERT INTO matriz_evaluaciones (
    fecha, sub_direccion_id, departamento_id, servicio_id, puesto_id, funcion_id, ubicacion, estado, observaciones
  )
  SELECT
    fecha, sub_direccion_id, departamento_id, servicio_id, puesto_id, funcion_id, ubicacion, estado, observaciones
  FROM evaluaciones_agrupadas
  RETURNING id AS evaluacion_id, fecha, sub_direccion_id, departamento_id, servicio_id, puesto_id, funcion_id, ubicacion, estado, observaciones
)
INSERT INTO tmp_matriz_evaluacion_map (
  fecha,
  sub_direccion_id,
  departamento_id,
  servicio_id,
  puesto_id,
  funcion_id,
  ubicacion,
  estado,
  observaciones,
  evaluacion_id
)
SELECT
  fecha,
  sub_direccion_id,
  departamento_id,
  servicio_id,
  puesto_id,
  funcion_id,
  ubicacion,
  estado,
  observaciones,
  evaluacion_id
FROM inserted_evaluaciones;

-- Reinsertar detalles a partir de la tabla histórica matriz_riesgos.
INSERT INTO matriz_evaluacion_detalles (
  evaluacion_id,
  riesgo_id,
  peligro_id,
  probabilidad,
  consecuencia,
  nivel,
  clasificacion,
  medidas_prev,
  acciones,
  recursos,
  fecha_cumplimiento,
  responsable,
  estado
)
SELECT
  map.evaluacion_id,
  mr.riesgo_id,
  mr.peligro_id,
  mr.probabilidad,
  mr.consecuencia,
  mr.nivel,
  mr.clasificacion,
  COALESCE(mr.medidas_prev, ''),
  COALESCE(mr.acciones, ''),
  COALESCE(mr.recursos, ''),
  mr.fecha_cumplimiento,
  COALESCE(mr.responsable, ''),
  COALESCE(NULLIF(mr.estado, ''), 'pendiente')
FROM matriz_riesgos mr
JOIN tmp_matriz_evaluacion_map map
  ON map.fecha = mr.fecha
 AND map.sub_direccion_id = mr.sub_direccion_id
 AND map.departamento_id = mr.departamento_id
 AND map.servicio_id = mr.servicio_id
 AND COALESCE(map.puesto_id, 0) = COALESCE(mr.puesto_id, 0)
 AND COALESCE(map.funcion_id, 0) = COALESCE(mr.funcion_id, 0)
 AND map.ubicacion = mr.ubicacion
 AND COALESCE(map.estado, 'pendiente') = COALESCE(mr.estado, 'pendiente')
 AND COALESCE(map.observaciones, '') = COALESCE(mr.observaciones, '');

UPDATE planificaciones p
SET evaluacion_id = map.evaluacion_id
FROM matriz_riesgos mr
JOIN tmp_matriz_evaluacion_map map
  ON map.fecha = mr.fecha
 AND map.sub_direccion_id = mr.sub_direccion_id
 AND map.departamento_id = mr.departamento_id
 AND map.servicio_id = mr.servicio_id
 AND COALESCE(map.puesto_id, 0) = COALESCE(mr.puesto_id, 0)
 AND COALESCE(map.funcion_id, 0) = COALESCE(mr.funcion_id, 0)
 AND map.ubicacion = mr.ubicacion
 AND COALESCE(map.estado, 'pendiente') = COALESCE(mr.estado, 'pendiente')
 AND COALESCE(map.observaciones, '') = COALESCE(mr.observaciones, '')
WHERE p.evaluacion_id = mr.id;

ALTER TABLE planificaciones
  DROP CONSTRAINT IF EXISTS planificaciones_evaluacion_id_fkey;

ALTER TABLE planificaciones
  ADD CONSTRAINT planificaciones_evaluacion_id_fkey
  FOREIGN KEY (evaluacion_id)
  REFERENCES matriz_evaluaciones(id)
  ON DELETE CASCADE;

COMMIT;
