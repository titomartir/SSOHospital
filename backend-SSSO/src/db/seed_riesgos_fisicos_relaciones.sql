BEGIN;

WITH required_peligros(nombre) AS (
  VALUES
    ('Iluminación'),
    ('Presión Atmosférica Anormal'),
    ('Radiaciones'),
    ('Ruido'),
    ('Temperaturas Extremas'),
    ('Vibraciones constantes')
), found_peligros AS (
  SELECT nombre, COUNT(*) AS cantidad
  FROM peligros
  WHERE nombre IN (SELECT nombre FROM required_peligros)
  GROUP BY nombre
)
SELECT 1 / CASE
  WHEN EXISTS (
    SELECT 1
    FROM required_peligros rp
    LEFT JOIN found_peligros fp ON fp.nombre = rp.nombre
    WHERE COALESCE(fp.cantidad, 0) <> 1
  ) THEN 0
  ELSE 1
END;

WITH required_medidas(nombre) AS (
  VALUES
    ('Mantener niveles adecuados de iluminación'),
    ('Mejorar las condiciones de iluminación de los puestos de trabajo'),
    ('Mantener en buenas condiciones los sistemas de iluminación'),
    ('Controlar el tiempo de exposición'),
    ('Controlar los niveles de exposición'),
    ('Implementar procedimientos de adaptación a condiciones de exposición'),
    ('Vigilar las condiciones del personal expuesto'),
    ('Implementar medidas de aislamiento y protección'),
    ('Controlar y vigilar la exposición del personal'),
    ('Reducir los niveles de ruido desde la fuente'),
    ('Proporcionar protección auditiva adecuada'),
    ('Mantener condiciones adecuadas de recuperación'),
    ('Proporcionar protección adecuada al personal expuesto'),
    ('Reducir las vibraciones generadas por equipos y herramientas'),
    ('Mantener condiciones seguras de operación de equipos y herramientas')
), found_medidas AS (
  SELECT nombre, COUNT(*) AS cantidad
  FROM medidas_preventivas
  WHERE nombre IN (SELECT nombre FROM required_medidas)
  GROUP BY nombre
)
SELECT 1 / CASE
  WHEN EXISTS (
    SELECT 1
    FROM required_medidas rm
    LEFT JOIN found_medidas fm ON fm.nombre = rm.nombre
    WHERE COALESCE(fm.cantidad, 0) <> 1
  ) THEN 0
  ELSE 1
END;

WITH required_acciones(nombre) AS (
  VALUES
    ('Realizar evaluaciones periódicas de los niveles de iluminación'),
    ('Identificar y registrar áreas con iluminación deficiente o excesiva'),
    ('Instalar o mejorar luminarias en áreas con iluminación insuficiente'),
    ('Reubicar luminarias para reducir sombras y deslumbramientos'),
    ('Realizar limpieza periódica de lámparas y luminarias'),
    ('Sustituir lámparas, luminarias o componentes defectuosos'),
    ('Evaluar las condiciones de trabajo antes de iniciar actividades con exposición'),
    ('Establecer tiempos seguros de exposición'),
    ('Establecer períodos graduales de adaptación'),
    ('Programar períodos de descanso y recuperación'),
    ('Realizar evaluación ocupacional del personal expuesto'),
    ('Establecer procedimientos para el reporte de síntomas o malestares'),
    ('Implementar rotación del personal'),
    ('Delimitar y señalizar áreas con riesgo de exposición'),
    ('Verificar el estado de barreras, blindajes y elementos de protección'),
    ('Realizar controles y mediciones periódicas de exposición'),
    ('Mantener actualizado el registro del personal expuesto'),
    ('Inspeccionar equipos, máquinas o instalaciones que produzcan ruido excesivo'),
    ('Realizar mantenimiento preventivo y correctivo de equipos'),
    ('Realizar mediciones periódicas de los niveles de ruido'),
    ('Entregar protección auditiva de acuerdo con las condiciones de exposición'),
    ('Capacitar al personal sobre el uso y conservación de la protección auditiva'),
    ('Habilitar áreas para descanso y recuperación térmica'),
    ('Garantizar disponibilidad de hidratación durante la exposición a temperaturas elevadas'),
    ('Proporcionar equipo o vestimenta de protección adecuada'),
    ('Inspeccionar periódicamente el estado del equipo de protección'),
    ('Inspeccionar equipos y herramientas que produzcan vibraciones excesivas'),
    ('Reparar o sustituir equipos que presenten condiciones inseguras'),
    ('Capacitar al personal sobre el uso seguro de equipos y herramientas')
), found_acciones AS (
  SELECT nombre, COUNT(*) AS cantidad
  FROM acciones
  WHERE nombre IN (SELECT nombre FROM required_acciones)
  GROUP BY nombre
)
SELECT 1 / CASE
  WHEN EXISTS (
    SELECT 1
    FROM required_acciones ra
    LEFT JOIN found_acciones fa ON fa.nombre = ra.nombre
    WHERE COALESCE(fa.cantidad, 0) <> 1
  ) THEN 0
  ELSE 1
END;

WITH required_recursos(nombre) AS (
  VALUES
    ('Luxómetro'),
    ('Formato de inspección'),
    ('Registro de hallazgos'),
    ('Luminarias'),
    ('Materiales eléctricos'),
    ('Herramientas'),
    ('Accesorios eléctricos'),
    ('Equipo de limpieza'),
    ('Escalera'),
    ('Repuestos'),
    ('Formato de evaluación de condiciones de trabajo'),
    ('Procedimiento de trabajo seguro'),
    ('Registro de exposición'),
    ('Cronograma de trabajo'),
    ('Área de descanso'),
    ('Formato de evaluación ocupacional'),
    ('Expediente de salud ocupacional'),
    ('Formato de reporte'),
    ('Protocolo de atención'),
    ('Cronograma de rotación'),
    ('Señalización de seguridad'),
    ('Barreras de delimitación'),
    ('Equipo de medición de radiaciones'),
    ('Registro de mediciones'),
    ('Sonómetro'),
    ('Materiales de mantenimiento'),
    ('Tapones auditivos'),
    ('Orejeras de protección auditiva'),
    ('Material de capacitación'),
    ('Mobiliario'),
    ('Agua potable'),
    ('Dispensador de agua'),
    ('Equipo de protección térmica'),
    ('Vestimenta de protección'),
    ('Equipo de medición de vibraciones'),
    ('Manual de operación')
), found_recursos AS (
  SELECT nombre, COUNT(*) AS cantidad
  FROM recursos
  WHERE nombre IN (SELECT nombre FROM required_recursos)
  GROUP BY nombre
)
SELECT 1 / CASE
  WHEN EXISTS (
    SELECT 1
    FROM required_recursos rr
    LEFT JOIN found_recursos fr ON fr.nombre = rr.nombre
    WHERE COALESCE(fr.cantidad, 0) <> 1
  ) THEN 0
  ELSE 1
END;

WITH required_responsables(nombre) AS (
  VALUES
    ('Seguridad y Salud Ocupacional'),
    ('Jefe del Servicio'),
    ('Mantenimiento'),
    ('Salud Ocupacional'),
    ('Responsable del Área'),
    ('Almacén'),
    ('Administración')
), found_responsables AS (
  SELECT nombre, COUNT(*) AS cantidad
  FROM responsables
  WHERE nombre IN (SELECT nombre FROM required_responsables)
  GROUP BY nombre
)
SELECT 1 / CASE
  WHEN EXISTS (
    SELECT 1
    FROM required_responsables rr
    LEFT JOIN found_responsables fr ON fr.nombre = rr.nombre
    WHERE COALESCE(fr.cantidad, 0) <> 1
  ) THEN 0
  ELSE 1
END;

INSERT INTO peligro_medidas (peligro_id, medida_preventiva_id)
SELECT
  (SELECT id FROM peligros WHERE nombre = seed.peligro_nombre),
  (SELECT id FROM medidas_preventivas WHERE nombre = seed.medida_nombre)
FROM (
  VALUES
    ('Iluminación', 'Mantener niveles adecuados de iluminación'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto'),
    ('Radiaciones', 'Controlar el tiempo de exposición'),
    ('Radiaciones', 'Controlar los niveles de exposición'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente'),
    ('Ruido', 'Controlar los niveles de exposición'),
    ('Ruido', 'Controlar el tiempo de exposición'),
    ('Ruido', 'Proporcionar protección auditiva adecuada'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas')
) AS seed(peligro_nombre, medida_nombre);

INSERT INTO peligro_medida_acciones (peligro_medida_id, accion_id)
SELECT
  (
    SELECT pm.id
    FROM peligro_medidas pm
    JOIN peligros p ON p.id = pm.peligro_id
    JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
    WHERE p.nombre = seed.peligro_nombre
      AND mp.nombre = seed.medida_nombre
  ),
  (SELECT id FROM acciones WHERE nombre = seed.accion_nombre)
FROM (
  VALUES
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Realizar evaluaciones periódicas de los niveles de iluminación'),
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Identificar y registrar áreas con iluminación deficiente o excesiva'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Instalar o mejorar luminarias en áreas con iluminación insuficiente'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Reubicar luminarias para reducir sombras y deslumbramientos'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Realizar limpieza periódica de lámparas y luminarias'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Sustituir lámparas, luminarias o componentes defectuosos'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Evaluar las condiciones de trabajo antes de iniciar actividades con exposición'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Establecer períodos graduales de adaptación'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Programar períodos de descanso y recuperación'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Realizar evaluación ocupacional del personal expuesto'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Establecer procedimientos para el reporte de síntomas o malestares'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Implementar rotación del personal'),
    ('Radiaciones', 'Controlar los niveles de exposición', 'Realizar controles y mediciones periódicas de exposición'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Delimitar y señalizar áreas con riesgo de exposición'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Verificar el estado de barreras, blindajes y elementos de protección'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Realizar controles y mediciones periódicas de exposición'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Mantener actualizado el registro del personal expuesto'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Inspeccionar equipos, máquinas o instalaciones que produzcan ruido excesivo'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Realizar mantenimiento preventivo y correctivo de equipos'),
    ('Ruido', 'Controlar los niveles de exposición', 'Realizar mediciones periódicas de los niveles de ruido'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Implementar rotación del personal'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Entregar protección auditiva de acuerdo con las condiciones de exposición'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Capacitar al personal sobre el uso y conservación de la protección auditiva'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Implementar rotación del personal'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Habilitar áreas para descanso y recuperación térmica'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Garantizar disponibilidad de hidratación durante la exposición a temperaturas elevadas'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Proporcionar equipo o vestimenta de protección adecuada'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Inspeccionar periódicamente el estado del equipo de protección'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Inspeccionar equipos y herramientas que produzcan vibraciones excesivas'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Implementar rotación del personal'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Capacitar al personal sobre el uso seguro de equipos y herramientas')
) AS seed(peligro_nombre, medida_nombre, accion_nombre);

INSERT INTO peligro_medida_accion_recursos (peligro_medida_accion_id, recurso_id)
SELECT
  (
    SELECT pma.id
    FROM peligro_medida_acciones pma
    JOIN peligro_medidas pm ON pm.id = pma.peligro_medida_id
    JOIN peligros p ON p.id = pm.peligro_id
    JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
    JOIN acciones a ON a.id = pma.accion_id
    WHERE p.nombre = seed.peligro_nombre
      AND mp.nombre = seed.medida_nombre
      AND a.nombre = seed.accion_nombre
  ),
  (SELECT id FROM recursos WHERE nombre = seed.recurso_nombre)
FROM (
  VALUES
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Realizar evaluaciones periódicas de los niveles de iluminación', 'Luxómetro'),
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Realizar evaluaciones periódicas de los niveles de iluminación', 'Formato de inspección'),
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Identificar y registrar áreas con iluminación deficiente o excesiva', 'Formato de inspección'),
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Identificar y registrar áreas con iluminación deficiente o excesiva', 'Registro de hallazgos'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Instalar o mejorar luminarias en áreas con iluminación insuficiente', 'Luminarias'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Instalar o mejorar luminarias en áreas con iluminación insuficiente', 'Materiales eléctricos'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Instalar o mejorar luminarias en áreas con iluminación insuficiente', 'Herramientas'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Reubicar luminarias para reducir sombras y deslumbramientos', 'Herramientas'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Reubicar luminarias para reducir sombras y deslumbramientos', 'Accesorios eléctricos'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Realizar limpieza periódica de lámparas y luminarias', 'Equipo de limpieza'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Realizar limpieza periódica de lámparas y luminarias', 'Escalera'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Sustituir lámparas, luminarias o componentes defectuosos', 'Luminarias'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Sustituir lámparas, luminarias o componentes defectuosos', 'Repuestos'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Sustituir lámparas, luminarias o componentes defectuosos', 'Herramientas'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Evaluar las condiciones de trabajo antes de iniciar actividades con exposición', 'Formato de evaluación de condiciones de trabajo'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Procedimiento de trabajo seguro'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Registro de exposición'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación', 'Cronograma de trabajo'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación', 'Área de descanso'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Establecer períodos graduales de adaptación', 'Cronograma de trabajo'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Establecer períodos graduales de adaptación', 'Procedimiento de trabajo seguro'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Programar períodos de descanso y recuperación', 'Cronograma de trabajo'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Programar períodos de descanso y recuperación', 'Área de descanso'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Realizar evaluación ocupacional del personal expuesto', 'Formato de evaluación ocupacional'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Realizar evaluación ocupacional del personal expuesto', 'Expediente de salud ocupacional'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Establecer procedimientos para el reporte de síntomas o malestares', 'Formato de reporte'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Establecer procedimientos para el reporte de síntomas o malestares', 'Protocolo de atención'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Procedimiento de trabajo seguro'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Registro de exposición'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Cronograma de rotación'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Registro de exposición'),
    ('Radiaciones', 'Controlar los niveles de exposición', 'Realizar controles y mediciones periódicas de exposición', 'Equipo de medición de radiaciones'),
    ('Radiaciones', 'Controlar los niveles de exposición', 'Realizar controles y mediciones periódicas de exposición', 'Registro de mediciones'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Delimitar y señalizar áreas con riesgo de exposición', 'Señalización de seguridad'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Delimitar y señalizar áreas con riesgo de exposición', 'Barreras de delimitación'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Verificar el estado de barreras, blindajes y elementos de protección', 'Formato de inspección'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Realizar controles y mediciones periódicas de exposición', 'Equipo de medición de radiaciones'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Realizar controles y mediciones periódicas de exposición', 'Registro de mediciones'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Mantener actualizado el registro del personal expuesto', 'Registro de exposición'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Mantener actualizado el registro del personal expuesto', 'Expediente de salud ocupacional'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Inspeccionar equipos, máquinas o instalaciones que produzcan ruido excesivo', 'Sonómetro'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Inspeccionar equipos, máquinas o instalaciones que produzcan ruido excesivo', 'Formato de inspección'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Herramientas'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Repuestos'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Materiales de mantenimiento'),
    ('Ruido', 'Controlar los niveles de exposición', 'Realizar mediciones periódicas de los niveles de ruido', 'Sonómetro'),
    ('Ruido', 'Controlar los niveles de exposición', 'Realizar mediciones periódicas de los niveles de ruido', 'Registro de mediciones'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Procedimiento de trabajo seguro'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Registro de exposición'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Cronograma de rotación'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Registro de exposición'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Entregar protección auditiva de acuerdo con las condiciones de exposición', 'Tapones auditivos'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Entregar protección auditiva de acuerdo con las condiciones de exposición', 'Orejeras de protección auditiva'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Capacitar al personal sobre el uso y conservación de la protección auditiva', 'Material de capacitación'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Capacitar al personal sobre el uso y conservación de la protección auditiva', 'Tapones auditivos'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Capacitar al personal sobre el uso y conservación de la protección auditiva', 'Orejeras de protección auditiva'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Procedimiento de trabajo seguro'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Registro de exposición'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Cronograma de rotación'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Registro de exposición'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación', 'Cronograma de trabajo'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación', 'Área de descanso'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Habilitar áreas para descanso y recuperación térmica', 'Área de descanso'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Habilitar áreas para descanso y recuperación térmica', 'Mobiliario'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Garantizar disponibilidad de hidratación durante la exposición a temperaturas elevadas', 'Agua potable'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Garantizar disponibilidad de hidratación durante la exposición a temperaturas elevadas', 'Dispensador de agua'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Proporcionar equipo o vestimenta de protección adecuada', 'Equipo de protección térmica'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Proporcionar equipo o vestimenta de protección adecuada', 'Vestimenta de protección'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Inspeccionar periódicamente el estado del equipo de protección', 'Formato de inspección'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Inspeccionar periódicamente el estado del equipo de protección', 'Equipo de protección térmica'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Inspeccionar equipos y herramientas que produzcan vibraciones excesivas', 'Equipo de medición de vibraciones'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Inspeccionar equipos y herramientas que produzcan vibraciones excesivas', 'Formato de inspección'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Herramientas'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Repuestos'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Materiales de mantenimiento'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Herramientas'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Repuestos'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Procedimiento de trabajo seguro'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Registro de exposición'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Cronograma de rotación'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Registro de exposición'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Herramientas'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Repuestos'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Materiales de mantenimiento'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Herramientas'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Repuestos'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Capacitar al personal sobre el uso seguro de equipos y herramientas', 'Material de capacitación'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Capacitar al personal sobre el uso seguro de equipos y herramientas', 'Manual de operación')
) AS seed(peligro_nombre, medida_nombre, accion_nombre, recurso_nombre);

INSERT INTO peligro_medida_accion_responsables (peligro_medida_accion_id, responsable_id, tipo)
SELECT
  (
    SELECT pma.id
    FROM peligro_medida_acciones pma
    JOIN peligro_medidas pm ON pm.id = pma.peligro_medida_id
    JOIN peligros p ON p.id = pm.peligro_id
    JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
    JOIN acciones a ON a.id = pma.accion_id
    WHERE p.nombre = seed.peligro_nombre
      AND mp.nombre = seed.medida_nombre
      AND a.nombre = seed.accion_nombre
  ),
  (SELECT id FROM responsables WHERE nombre = seed.responsable_nombre),
  seed.tipo
FROM (
  VALUES
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Realizar evaluaciones periódicas de los niveles de iluminación', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Identificar y registrar áreas con iluminación deficiente o excesiva', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Iluminación', 'Mantener niveles adecuados de iluminación', 'Identificar y registrar áreas con iluminación deficiente o excesiva', 'Jefe del Servicio', 'APOYO'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Instalar o mejorar luminarias en áreas con iluminación insuficiente', 'Mantenimiento', 'PRINCIPAL'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Reubicar luminarias para reducir sombras y deslumbramientos', 'Mantenimiento', 'PRINCIPAL'),
    ('Iluminación', 'Mejorar las condiciones de iluminación de los puestos de trabajo', 'Reubicar luminarias para reducir sombras y deslumbramientos', 'Jefe del Servicio', 'APOYO'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Realizar limpieza periódica de lámparas y luminarias', 'Mantenimiento', 'PRINCIPAL'),
    ('Iluminación', 'Mantener en buenas condiciones los sistemas de iluminación', 'Sustituir lámparas, luminarias o componentes defectuosos', 'Mantenimiento', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Evaluar las condiciones de trabajo antes de iniciar actividades con exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Evaluar las condiciones de trabajo antes de iniciar actividades con exposición', 'Jefe del Servicio', 'APOYO'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Jefe del Servicio', 'APOYO'),
    ('Presión Atmosférica Anormal', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Establecer períodos graduales de adaptación', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Establecer períodos graduales de adaptación', 'Jefe del Servicio', 'APOYO'),
    ('Presión Atmosférica Anormal', 'Implementar procedimientos de adaptación a condiciones de exposición', 'Programar períodos de descanso y recuperación', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Realizar evaluación ocupacional del personal expuesto', 'Salud Ocupacional', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Establecer procedimientos para el reporte de síntomas o malestares', 'Salud Ocupacional', 'PRINCIPAL'),
    ('Presión Atmosférica Anormal', 'Vigilar las condiciones del personal expuesto', 'Establecer procedimientos para el reporte de síntomas o malestares', 'Jefe del Servicio', 'APOYO'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Responsable del Área', 'APOYO'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Radiaciones', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Responsable del Área', 'APOYO'),
    ('Radiaciones', 'Controlar los niveles de exposición', 'Realizar controles y mediciones periódicas de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Radiaciones', 'Controlar los niveles de exposición', 'Realizar controles y mediciones periódicas de exposición', 'Responsable del Área', 'APOYO'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Delimitar y señalizar áreas con riesgo de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Delimitar y señalizar áreas con riesgo de exposición', 'Responsable del Área', 'APOYO'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Verificar el estado de barreras, blindajes y elementos de protección', 'Responsable del Área', 'PRINCIPAL'),
    ('Radiaciones', 'Implementar medidas de aislamiento y protección', 'Verificar el estado de barreras, blindajes y elementos de protección', 'Mantenimiento', 'APOYO'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Realizar controles y mediciones periódicas de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Realizar controles y mediciones periódicas de exposición', 'Responsable del Área', 'APOYO'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Mantener actualizado el registro del personal expuesto', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Radiaciones', 'Controlar y vigilar la exposición del personal', 'Mantener actualizado el registro del personal expuesto', 'Salud Ocupacional', 'APOYO'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Inspeccionar equipos, máquinas o instalaciones que produzcan ruido excesivo', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Inspeccionar equipos, máquinas o instalaciones que produzcan ruido excesivo', 'Mantenimiento', 'APOYO'),
    ('Ruido', 'Reducir los niveles de ruido desde la fuente', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Mantenimiento', 'PRINCIPAL'),
    ('Ruido', 'Controlar los niveles de exposición', 'Realizar mediciones periódicas de los niveles de ruido', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Jefe del Servicio', 'APOYO'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Ruido', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Seguridad y Salud Ocupacional', 'APOYO'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Entregar protección auditiva de acuerdo con las condiciones de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Entregar protección auditiva de acuerdo con las condiciones de exposición', 'Almacén', 'APOYO'),
    ('Ruido', 'Proporcionar protección auditiva adecuada', 'Capacitar al personal sobre el uso y conservación de la protección auditiva', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Jefe del Servicio', 'APOYO'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Seguridad y Salud Ocupacional', 'APOYO'),
    ('Temperaturas Extremas', 'Controlar el tiempo de exposición', 'Programar períodos de descanso y recuperación', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Habilitar áreas para descanso y recuperación térmica', 'Administración', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Habilitar áreas para descanso y recuperación térmica', 'Jefe del Servicio', 'APOYO'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Garantizar disponibilidad de hidratación durante la exposición a temperaturas elevadas', 'Administración', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Mantener condiciones adecuadas de recuperación', 'Garantizar disponibilidad de hidratación durante la exposición a temperaturas elevadas', 'Jefe del Servicio', 'APOYO'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Proporcionar equipo o vestimenta de protección adecuada', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Proporcionar equipo o vestimenta de protección adecuada', 'Almacén', 'APOYO'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Inspeccionar periódicamente el estado del equipo de protección', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Temperaturas Extremas', 'Proporcionar protección adecuada al personal expuesto', 'Inspeccionar periódicamente el estado del equipo de protección', 'Jefe del Servicio', 'APOYO'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Inspeccionar equipos y herramientas que produzcan vibraciones excesivas', 'Mantenimiento', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Inspeccionar equipos y herramientas que produzcan vibraciones excesivas', 'Seguridad y Salud Ocupacional', 'APOYO'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Mantenimiento', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Mantenimiento', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Reducir las vibraciones generadas por equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Administración', 'APOYO'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Establecer tiempos seguros de exposición', 'Jefe del Servicio', 'APOYO'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Jefe del Servicio', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Controlar el tiempo de exposición', 'Implementar rotación del personal', 'Seguridad y Salud Ocupacional', 'APOYO'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Realizar mantenimiento preventivo y correctivo de equipos', 'Mantenimiento', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Mantenimiento', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Reparar o sustituir equipos que presenten condiciones inseguras', 'Administración', 'APOYO'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Capacitar al personal sobre el uso seguro de equipos y herramientas', 'Seguridad y Salud Ocupacional', 'PRINCIPAL'),
    ('Vibraciones constantes', 'Mantener condiciones seguras de operación de equipos y herramientas', 'Capacitar al personal sobre el uso seguro de equipos y herramientas', 'Jefe del Servicio', 'APOYO')
) AS seed(peligro_nombre, medida_nombre, accion_nombre, responsable_nombre, tipo);

COMMIT;