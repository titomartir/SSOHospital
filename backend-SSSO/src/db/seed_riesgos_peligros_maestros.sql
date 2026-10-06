-- Catálogo maestro institucional Riesgo -> Peligro.
-- Ejecutar antes de los seeds relacionales, con el esquema existente preparado.
-- Se conservan exactamente los nombres canónicos de producción.
-- Solo se insertan registros faltantes: no se corrigen relaciones existentes.

BEGIN;

-- Los cinco riesgos institucionales; no incluye el riesgo histórico de compatibilidad.
INSERT INTO riesgos (nombre) VALUES
  ('Riesgo Químico'),
  ('Riesgo Biológico'),
  ('Riesgos Ergonómicos'),
  ('Psicosociales'),
  ('Riesgos Físicos')
ON CONFLICT (nombre) DO NOTHING;

-- Los 37 peligros: cada riesgo_id se obtiene por el nombre del riesgo, nunca por ID fijo.
INSERT INTO peligros (nombre, riesgo_id)
SELECT
  seed.peligro_nombre,
  (SELECT id FROM riesgos WHERE nombre = seed.riesgo_nombre)
FROM (
  VALUES
    -- Riesgo Químico: 5 peligros.
    ('Riesgo Químico', 'Cancerigenos/Mutagenicos'),
    ('Riesgo Químico', 'Corrosivos'),
    ('Riesgo Químico', 'Irritantes'),
    ('Riesgo Químico', 'Sensibilizantes'),
    ('Riesgo Químico', 'Toxicos/Asfixiantes'),
    -- Riesgo Biológico: 10 peligros.
    ('Riesgo Biológico', 'Virus'),
    ('Riesgo Biológico', 'Bacterias'),
    ('Riesgo Biológico', 'Agujas y material punzocortante'),
    ('Riesgo Biológico', 'Contacto con microorganismos'),
    ('Riesgo Biológico', 'Contaminación de superficies/equipos'),
    ('Riesgo Biológico', 'Convivencia con pacientes infectados'),
    ('Riesgo Biológico', 'Exposicion a sangre y fluidos corporales'),
    ('Riesgo Biológico', 'Mala higiene de manos'),
    ('Riesgo Biológico', 'Residuos hospitalarios'),
    ('Riesgo Biológico', 'Aerosoles'),
    -- Riesgos Ergonómicos: 6 peligros.
    ('Riesgos Ergonómicos', 'Manipulación manual de cargas'),
    ('Riesgos Ergonómicos', 'Movimientos repetitivos'),
    ('Riesgos Ergonómicos', 'Fuerza excesiva'),
    ('Riesgos Ergonómicos', 'Vibración'),
    ('Riesgos Ergonómicos', 'Duración, intensidad y frecuencia de las tareas'),
    ('Riesgos Ergonómicos', 'Posturas forzadas o incómodas'),
    -- Psicosociales: 10 peligros.
    ('Psicosociales', 'Sobrecarga laboral'),
    ('Psicosociales', 'Jordanas extenuantes'),
    ('Psicosociales', 'Presión temporal'),
    ('Psicosociales', 'Violencia externa'),
    ('Psicosociales', 'Conflictos internos'),
    ('Psicosociales', 'Acoso laboral'),
    ('Psicosociales', 'Carga emocional'),
    ('Psicosociales', 'Doble presencia'),
    ('Psicosociales', 'Ambigüedad de rol'),
    ('Psicosociales', 'Escasez de recursos'),
    -- Riesgos Físicos: 6 peligros.
    ('Riesgos Físicos', 'Ruido'),
    ('Riesgos Físicos', 'Iluminación'),
    ('Riesgos Físicos', 'Temperaturas Extremas'),
    ('Riesgos Físicos', 'Radiaciones'),
    ('Riesgos Físicos', 'Presión Atmosférica Anormal'),
    ('Riesgos Físicos', 'Vibraciones constantes')
) AS seed(riesgo_nombre, peligro_nombre)
ON CONFLICT (nombre) DO NOTHING;

-- Validaciones de solo lectura sobre los catálogos, antes de confirmar la transacción.
-- Se permiten registros adicionales en ambas tablas durante la transición.
-- Una excepción no capturada deja la transacción abortada e impide su confirmación.
DO $$
DECLARE
  riesgos_faltantes TEXT;
  peligros_incorrectos TEXT;
  cantidad_pares INTEGER;
  cantidad_riesgos INTEGER;
  cantidad_peligros INTEGER;
BEGIN
  WITH riesgos_esperados(nombre) AS (
    VALUES
      ('Riesgo Químico'),
      ('Riesgo Biológico'),
      ('Riesgos Ergonómicos'),
      ('Psicosociales'),
      ('Riesgos Físicos')
  )
  SELECT string_agg(esperado.nombre, ', ' ORDER BY esperado.nombre)
  INTO riesgos_faltantes
  FROM riesgos_esperados esperado
  WHERE NOT EXISTS (
    SELECT 1 FROM riesgos WHERE nombre = esperado.nombre
  );

  IF riesgos_faltantes IS NOT NULL THEN
    RAISE EXCEPTION 'Faltan riesgos canónicos: %', riesgos_faltantes;
  END IF;

  WITH catalogo_esperado(riesgo_nombre, peligro_nombre) AS (
    VALUES
      ('Riesgo Químico', 'Cancerigenos/Mutagenicos'),
      ('Riesgo Químico', 'Corrosivos'),
      ('Riesgo Químico', 'Irritantes'),
      ('Riesgo Químico', 'Sensibilizantes'),
      ('Riesgo Químico', 'Toxicos/Asfixiantes'),
      ('Riesgo Biológico', 'Virus'),
      ('Riesgo Biológico', 'Bacterias'),
      ('Riesgo Biológico', 'Agujas y material punzocortante'),
      ('Riesgo Biológico', 'Contacto con microorganismos'),
      ('Riesgo Biológico', 'Contaminación de superficies/equipos'),
      ('Riesgo Biológico', 'Convivencia con pacientes infectados'),
      ('Riesgo Biológico', 'Exposicion a sangre y fluidos corporales'),
      ('Riesgo Biológico', 'Mala higiene de manos'),
      ('Riesgo Biológico', 'Residuos hospitalarios'),
      ('Riesgo Biológico', 'Aerosoles'),
      ('Riesgos Ergonómicos', 'Manipulación manual de cargas'),
      ('Riesgos Ergonómicos', 'Movimientos repetitivos'),
      ('Riesgos Ergonómicos', 'Fuerza excesiva'),
      ('Riesgos Ergonómicos', 'Vibración'),
      ('Riesgos Ergonómicos', 'Duración, intensidad y frecuencia de las tareas'),
      ('Riesgos Ergonómicos', 'Posturas forzadas o incómodas'),
      ('Psicosociales', 'Sobrecarga laboral'),
      ('Psicosociales', 'Jordanas extenuantes'),
      ('Psicosociales', 'Presión temporal'),
      ('Psicosociales', 'Violencia externa'),
      ('Psicosociales', 'Conflictos internos'),
      ('Psicosociales', 'Acoso laboral'),
      ('Psicosociales', 'Carga emocional'),
      ('Psicosociales', 'Doble presencia'),
      ('Psicosociales', 'Ambigüedad de rol'),
      ('Psicosociales', 'Escasez de recursos'),
      ('Riesgos Físicos', 'Ruido'),
      ('Riesgos Físicos', 'Iluminación'),
      ('Riesgos Físicos', 'Temperaturas Extremas'),
      ('Riesgos Físicos', 'Radiaciones'),
      ('Riesgos Físicos', 'Presión Atmosférica Anormal'),
      ('Riesgos Físicos', 'Vibraciones constantes')
  )
  SELECT
    COUNT(*),
    COUNT(DISTINCT esperado.riesgo_nombre),
    COUNT(DISTINCT esperado.peligro_nombre),
    string_agg(
      esperado.riesgo_nombre || ' -> ' || esperado.peligro_nombre,
      '; ' ORDER BY esperado.riesgo_nombre, esperado.peligro_nombre
    ) FILTER (WHERE NOT EXISTS (
      SELECT 1
      FROM peligros peligro
      JOIN riesgos riesgo ON riesgo.id = peligro.riesgo_id
      WHERE peligro.nombre = esperado.peligro_nombre
        AND riesgo.nombre = esperado.riesgo_nombre
    ))
  INTO cantidad_pares, cantidad_riesgos, cantidad_peligros, peligros_incorrectos
  FROM catalogo_esperado esperado;

  -- Estos conteos comprueban el catálogo esperado, no el total de filas de las tablas.
  IF cantidad_pares <> 37 OR cantidad_riesgos <> 5 OR cantidad_peligros <> 37 THEN
    RAISE EXCEPTION 'Catálogo esperado inválido: % pares, % riesgos y % peligros únicos',
      cantidad_pares, cantidad_riesgos, cantidad_peligros;
  END IF;

  IF peligros_incorrectos IS NOT NULL THEN
    RAISE EXCEPTION 'Peligros canónicos ausentes o relacionados con un riesgo incorrecto: %',
      peligros_incorrectos;
  END IF;
END;
$$;

-- Riesgo General es un fallback histórico de migración; solo se elimina si quedó vacío.
-- Si tiene peligros asociados, se conserva para evitar pérdida de datos.
DELETE FROM riesgos
WHERE nombre = 'Riesgo General'
  AND NOT EXISTS (
      SELECT 1
      FROM peligros
      WHERE peligros.riesgo_id = riesgos.id
  );

COMMIT;