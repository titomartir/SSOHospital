-- ============================================================
-- SSOHospital
-- Seed: Riesgos Químicos, Biológicos y Ergonómicos
-- Archivo:
-- seed_riesgos_quimicos_biologicos_ergonomicos.sql
--
-- IMPORTANTE:
-- Este archivo complementa los catálogos existentes.
-- No elimina registros existentes.
-- Reutiliza elementos equivalentes cuando ya existen.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. RESPONSABLES
-- ============================================================

INSERT INTO responsables (nombre)
VALUES
    ('Recursos Humanos'),
    ('Departamento de Capacitación'),
    ('Unidad de Bienestar Laboral'),
    ('Trabajador'),
    ('Epidemiología')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO responsables (nombre)
VALUES
    ('Seguridad y Salud Ocupacional'),
    ('Jefe del Servicio'),
    ('Responsable del Área'),
    ('Mantenimiento'),
    ('Salud Ocupacional')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 2. MEDIDAS PREVENTIVAS
-- Riesgo Químico
-- ============================================================

INSERT INTO medidas_preventivas (nombre)
VALUES
    ('Garantizar ventilación adecuada en áreas donde se utilizan productos químicos'),
    ('Evitar mezclas incompatibles de productos químicos'),
    ('Implementar medidas de protección personal para la manipulación de sustancias químicas'),
    ('Establecer protocolos para la atención de derrames químicos'),
    ('Implementar un sistema de identificación y etiquetado de sustancias químicas'),
    ('Identificar y clasificar las sustancias químicas utilizadas'),
    ('Identificar y señalizar las áreas de almacenamiento y manipulación de sustancias químicas'),
    ('Registrar y analizar accidentes e incidentes relacionados con sustancias químicas')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 3. MEDIDAS PREVENTIVAS
-- Riesgo Biológico
-- ============================================================

INSERT INTO medidas_preventivas (nombre)
VALUES
    ('Utilizar equipo de protección personal frente a exposición biológica'),
    ('Aplicar protocolos de actuación ante accidentes con exposición biológica'),
    ('Aplicar prácticas seguras para el manejo y descarte de objetos punzocortantes'),
    ('Utilizar medidas de aislamiento para pacientes con riesgo de transmisión'),
    ('Aplicar medidas universales de prevención y control de infecciones'),
    ('Mantener una adecuada higiene de manos'),
    ('Aplicar procedimientos seguros para el manejo de residuos hospitalarios'),
    ('Aplicar medidas de prevención frente a aerosoles y exposición respiratoria'),
    ('Prevenir la contaminación de superficies y equipos'),
    ('Aplicar procedimientos seguros para el contacto con microorganismos')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 4. MEDIDAS PREVENTIVAS
-- Riesgo Ergonómico
-- ============================================================

INSERT INTO medidas_preventivas (nombre)
VALUES
    ('Organizar las tareas procurando una distribución equilibrada de la carga de trabajo'),
    ('Establecer pausas y alternancia de actividades'),
    ('Evitar esfuerzos superiores a las capacidades del trabajador'),
    ('Utilizar ayudas mecánicas o apoyo de otros colaboradores'),
    ('Evitar levantar, transportar o movilizar cargas innecesariamente'),
    ('Aplicar técnicas adecuadas de levantamiento y transporte'),
    ('Alternar actividades y evitar la repetición continua de un mismo movimiento'),
    ('Adecuar el puesto de trabajo y favorecer posturas neutrales'),
    ('Evitar permanecer durante períodos prolongados en una misma posición')
ON CONFLICT (nombre) DO NOTHING;

-- Las medidas de vibración ya disponen de conceptos equivalentes
-- en el catálogo existente y serán reutilizadas.

INSERT INTO medidas_preventivas (nombre)
VALUES
    ('Reducir la exposición a sustancias cancerígenas o mutagénicas'),
    ('Utilizar equipo de protección personal adecuado'),
    ('Evitar el contacto directo con sustancias corrosivas'),
    ('Reducir la exposición a sustancias irritantes'),
    ('Mantener ventilación adecuada en áreas donde se utilizan productos químicos'),
    ('Reducir la exposición a sustancias sensibilizantes'),
    ('Aplicar precauciones estándar para prevenir la exposición a agentes biológicos'),
    ('Utilizar equipo de protección personal según el nivel de exposición'),
    ('Fortalecer las prácticas de higiene de manos'),
    ('Prevenir accidentes con agujas y material punzocortante'),
    ('Garantizar el descarte seguro de objetos punzocortantes'),
    ('Mantener procedimientos adecuados de limpieza y desinfección'),
    ('Aplicar medidas de aislamiento según el tipo de transmisión'),
    ('Mantener protocolos de actuación ante exposición biológica accidental'),
    ('Garantizar el manejo y segregación adecuada de residuos hospitalarios'),
    ('Reducir la exposición a aerosoles potencialmente contaminados'),
    ('Utilizar protección respiratoria adecuada'),
    ('Evitar la manipulación manual innecesaria de cargas'),
    ('Alternar actividades y reducir la repetición continua de movimientos'),
    ('Establecer pausas activas y períodos de recuperación'),
    ('Reducir el tiempo de exposición a vibraciones'),
    ('Utilizar equipos y elementos que reduzcan la transmisión de vibraciones')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 5. ACCIONES
-- Riesgo Químico
-- ============================================================

INSERT INTO acciones (nombre)
VALUES
    ('Verificar las condiciones de ventilación de las áreas de trabajo'),
    ('Notificar deficiencias en los sistemas de ventilación'),
    ('Verificar la señalización de sustancias y áreas con riesgo químico'),
    ('Supervisar el uso correcto del equipo de protección personal'),
    ('Capacitar al personal sobre actuación ante derrames químicos'),
    ('Verificar la correcta ubicación y etiquetado de sustancias químicas'),
    ('Establecer una ruta de atención ante accidentes con sustancias químicas'),
    ('Capacitar al personal sobre almacenamiento seguro de sustancias químicas')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 6. ACCIONES
-- Riesgo Biológico
-- ============================================================

INSERT INTO acciones (nombre)
VALUES
    ('Asegurar la disponibilidad de equipo de protección personal por servicio'),
    ('Supervisar el uso de equipo de protección personal'),
    ('Utilizar sistemas cerrados para transportar y procesar muestras'),
    ('Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica'),
    ('Mantener disponible el flujograma de atención ante exposición biológica'),
    ('Reforzar el protocolo de manejo y descarte de material contaminado'),
    ('Realizar el descarte correcto de objetos punzocortantes'),
    ('Verificar la disponibilidad y ubicación de recipientes para objetos punzocortantes'),
    ('Capacitar al personal sobre medidas de aislamiento'),
    ('Reforzar periódicamente los protocolos de prevención de infecciones'),
    ('Supervisar el cumplimiento de higiene de manos'),
    ('Verificar la correcta segregación y manejo de residuos hospitalarios'),
    ('Realizar limpieza y desinfección de superficies y equipos'),
    ('Aplicar medidas de protección respiratoria cuando exista riesgo de aerosoles')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 7. ACCIONES
-- Riesgo Ergonómico
-- ============================================================

INSERT INTO acciones (nombre)
VALUES
    ('Redistribuir actividades cuando exista sobrecarga de trabajo'),
    ('Alternar tareas de diferente exigencia física'),
    ('Implementar pausas activas y períodos de recuperación'),
    ('Identificar tareas que requieran aplicar fuerza excesiva'),
    ('Utilizar técnicas adecuadas de empuje, tracción y movilización'),
    ('Realizar tareas entre dos o más personas cuando sea necesario'),
    ('Evaluar el peso y las características de las cargas'),
    ('Mantener despejadas las rutas de traslado'),
    ('Utilizar ayudas mecánicas para la movilización de cargas'),
    ('Capacitar al personal sobre manipulación segura de cargas'),
    ('Identificar tareas con alta frecuencia de movimientos repetitivos'),
    ('Rotar al personal entre actividades cuando sea posible'),
    ('Revisar la organización y distribución del trabajo'),
    ('Ajustar la altura y ubicación del mobiliario y equipos'),
    ('Reorganizar elementos de uso frecuente para evitar posturas forzadas'),
    ('Capacitar al personal sobre higiene postural'),
    ('Limitar el tiempo de exposición a vibraciones'),
    ('Alternar tareas con exposición a vibraciones'),
    ('Utilizar elementos que disminuyan la transmisión de vibraciones')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO acciones (nombre)
VALUES
    ('Identificar y señalizar las sustancias cancerígenas o mutagénicas'),
    ('Limitar el tiempo de exposición a sustancias químicas peligrosas'),
    ('Verificar el uso correcto del equipo de protección personal'),
    ('Verificar el etiquetado correcto de sustancias químicas'),
    ('Mantener disponibles procedimientos para la atención de derrames químicos'),
    ('Verificar periódicamente el funcionamiento de los sistemas de ventilación')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- 8. RECURSOS
-- ============================================================

INSERT INTO recursos (nombre)
VALUES
    ('Sistema de ventilación'),
    ('Extractor de aire'),
    ('Ventilador'),
    ('Equipo de protección personal'),
    ('Etiquetas para sustancias químicas'),
    ('Recipientes para almacenamiento seguro de sustancias químicas'),
    ('Kit para atención de derrames químicos'),
    ('Flujograma de atención'),
    ('Recipiente rígido para objetos punzocortantes'),
    ('Insumos para higiene de manos'),
    ('Material para limpieza y desinfección'),
    ('Contenedores para residuos hospitalarios'),
    ('Equipo de protección respiratoria'),
    ('Rol de turnos'),
    ('Material para pausas activas'),
    ('Carro de transporte'),
    ('Camilla'),
    ('Dispositivo de movilización'),
    ('Plataforma de transporte'),
    ('Ayuda mecánica para movilización de cargas'),
    ('Mobiliario ergonómico'),
    ('Herramientas ergonómicas'),
    ('Elementos antivibración')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO recursos (nombre)
VALUES
    ('Registro de exposición'),
    ('Material de capacitación'),
    ('Formato de evaluación de condiciones de trabajo'),
    ('Señalización de seguridad'),
    ('Cronograma de rotación'),
    ('Procedimiento de trabajo seguro')
ON CONFLICT (nombre) DO NOTHING;


-- ============================================================
-- FIN PARTE 3A.11-A
-- NO colocar COMMIT todavía.
-- Las relaciones se agregan en los siguientes bloques.
-- ============================================================

-- ============================================================
-- 9. RELACIONES PELIGRO -> MEDIDA PREVENTIVA
-- Riesgos Químicos, Biológicos y Ergonómicos
-- ============================================================

INSERT INTO peligro_medidas (peligro_id, medida_preventiva_id)

SELECT
    p.id,
    mp.id
FROM (
    VALUES

    -- ========================================================
    -- RIESGO QUÍMICO
    -- ========================================================

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas'),

    ('Cancerigenos/Mutagenicos',
     'Utilizar equipo de protección personal adecuado'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas'),

    ('Corrosivos',
     'Utilizar equipo de protección personal adecuado'),

    ('Irritantes',
     'Reducir la exposición a sustancias irritantes'),

    ('Irritantes',
     'Mantener ventilación adecuada en áreas donde se utilizan productos químicos'),

    ('Sensibilizantes',
     'Reducir la exposición a sustancias sensibilizantes'),

    ('Sensibilizantes',
     'Utilizar equipo de protección personal adecuado'),

    ('Toxicos/Asfixiantes',
     'Garantizar ventilación adecuada en áreas donde se utilizan productos químicos'),

    ('Toxicos/Asfixiantes',
     'Evitar mezclas incompatibles de productos químicos'),


    -- ========================================================
    -- RIESGO BIOLÓGICO
    -- ========================================================

    ('Virus',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos'),

    ('Virus',
     'Utilizar equipo de protección personal según el nivel de exposición'),

    ('Bacterias',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos'),

    ('Bacterias',
     'Fortalecer las prácticas de higiene de manos'),

    ('Agujas y material punzocortante',
     'Prevenir accidentes con agujas y material punzocortante'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes'),

    ('Contacto con microorganismos',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos'),

    ('Contacto con microorganismos',
     'Utilizar equipo de protección personal según el nivel de exposición'),

    ('Contaminación de superficies/equipos',
     'Mantener procedimientos adecuados de limpieza y desinfección'),

    ('Convivencia con pacientes infectados',
     'Aplicar medidas de aislamiento según el tipo de transmisión'),

    ('Convivencia con pacientes infectados',
     'Utilizar equipo de protección personal según el nivel de exposición'),

    ('Exposicion a sangre y fluidos corporales',
     'Utilizar equipo de protección personal según el nivel de exposición'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental'),

    ('Mala higiene de manos',
     'Fortalecer las prácticas de higiene de manos'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios'),

    ('Aerosoles',
     'Reducir la exposición a aerosoles potencialmente contaminados'),

    ('Aerosoles',
     'Utilizar protección respiratoria adecuada'),


    -- ========================================================
    -- RIESGO ERGONÓMICO
    -- ========================================================

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos'),

    ('Movimientos repetitivos',
     'Establecer pausas activas y períodos de recuperación'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones'),

    ('Vibración',
     'Utilizar equipos y elementos que reduzcan la transmisión de vibraciones'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales'),

    ('Posturas forzadas o incómodas',
     'Evitar permanecer durante períodos prolongados en una misma posición')

) AS seed(peligro_nombre, medida_nombre)

JOIN peligros p
    ON p.nombre = seed.peligro_nombre

JOIN medidas_preventivas mp
    ON mp.nombre = seed.medida_nombre

ON CONFLICT DO NOTHING;


-- ============================================================
-- FIN BLOQUE 3A.11-C
-- TODAVÍA NO COLOCAR COMMIT
-- ============================================================

-- ============================================================
-- 10. RELACIONES MEDIDA PREVENTIVA -> ACCIÓN
-- Riesgos Químicos, Biológicos y Ergonómicos
-- ============================================================

INSERT INTO peligro_medida_acciones (peligro_medida_id, accion_id)

SELECT
    pm.id,
    a.id
FROM (
    VALUES

    -- ========================================================
    -- RIESGO QUÍMICO
    -- ========================================================

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas',
     'Identificar y señalizar las sustancias cancerígenas o mutagénicas'),

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas'),

    ('Cancerigenos/Mutagenicos',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas',
     'Verificar el etiquetado correcto de sustancias químicas'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas',
     'Mantener disponibles procedimientos para la atención de derrames químicos'),

    ('Corrosivos',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Irritantes',
     'Reducir la exposición a sustancias irritantes',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas'),

    ('Irritantes',
     'Mantener ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación'),

    ('Sensibilizantes',
     'Reducir la exposición a sustancias sensibilizantes',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas'),

    ('Sensibilizantes',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Toxicos/Asfixiantes',
     'Garantizar ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación'),

    ('Toxicos/Asfixiantes',
     'Evitar mezclas incompatibles de productos químicos',
     'Verificar el etiquetado correcto de sustancias químicas'),


    -- ========================================================
    -- RIESGO BIOLÓGICO
    -- ========================================================

    ('Virus',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones'),

    ('Virus',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Bacterias',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones'),

    ('Bacterias',
     'Fortalecer las prácticas de higiene de manos',
     'Supervisar el cumplimiento de higiene de manos'),

    ('Agujas y material punzocortante',
     'Prevenir accidentes con agujas y material punzocortante',
     'Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes',
     'Realizar el descarte correcto de objetos punzocortantes'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes',
     'Verificar la disponibilidad y ubicación de recipientes para objetos punzocortantes'),

    ('Contacto con microorganismos',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones'),

    ('Contacto con microorganismos',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Contaminación de superficies/equipos',
     'Mantener procedimientos adecuados de limpieza y desinfección',
     'Realizar limpieza y desinfección de superficies y equipos'),

    ('Convivencia con pacientes infectados',
     'Aplicar medidas de aislamiento según el tipo de transmisión',
     'Capacitar al personal sobre medidas de aislamiento'),

    ('Convivencia con pacientes infectados',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Exposicion a sangre y fluidos corporales',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental',
     'Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental',
     'Mantener disponible el flujograma de atención ante exposición biológica'),

    ('Mala higiene de manos',
     'Fortalecer las prácticas de higiene de manos',
     'Supervisar el cumplimiento de higiene de manos'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios',
     'Verificar la correcta segregación y manejo de residuos hospitalarios'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios',
     'Reforzar el protocolo de manejo y descarte de material contaminado'),

    ('Aerosoles',
     'Reducir la exposición a aerosoles potencialmente contaminados',
     'Reforzar periódicamente los protocolos de prevención de infecciones'),

    ('Aerosoles',
     'Utilizar protección respiratoria adecuada',
     'Aplicar medidas de protección respiratoria cuando exista riesgo de aerosoles'),


    -- ========================================================
    -- RIESGO ERGONÓMICO
    -- ========================================================

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Evaluar el peso y las características de las cargas'),

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Utilizar ayudas mecánicas para la movilización de cargas'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte',
     'Capacitar al personal sobre manipulación segura de cargas'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte',
     'Mantener despejadas las rutas de traslado'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos',
     'Identificar tareas con alta frecuencia de movimientos repetitivos'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos',
     'Rotar al personal entre actividades cuando sea posible'),

    ('Movimientos repetitivos',
     'Establecer pausas activas y períodos de recuperación',
     'Implementar pausas activas y períodos de recuperación'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador',
     'Identificar tareas que requieran aplicar fuerza excesiva'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador',
     'Realizar tareas entre dos o más personas cuando sea necesario'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores',
     'Utilizar técnicas adecuadas de empuje, tracción y movilización'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores',
     'Utilizar ayudas mecánicas para la movilización de cargas'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones',
     'Limitar el tiempo de exposición a vibraciones'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones',
     'Alternar tareas con exposición a vibraciones'),

    ('Vibración',
     'Utilizar equipos y elementos que reduzcan la transmisión de vibraciones',
     'Utilizar elementos que disminuyan la transmisión de vibraciones'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo',
     'Redistribuir actividades cuando exista sobrecarga de trabajo'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo',
     'Revisar la organización y distribución del trabajo'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades',
     'Alternar tareas de diferente exigencia física'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades',
     'Implementar pausas activas y períodos de recuperación'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Ajustar la altura y ubicación del mobiliario y equipos'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Reorganizar elementos de uso frecuente para evitar posturas forzadas'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Capacitar al personal sobre higiene postural'),

    ('Posturas forzadas o incómodas',
     'Evitar permanecer durante períodos prolongados en una misma posición',
     'Alternar tareas de diferente exigencia física')

) AS seed(peligro_nombre, medida_nombre, accion_nombre)

JOIN peligros p
    ON p.nombre = seed.peligro_nombre

JOIN medidas_preventivas mp
    ON mp.nombre = seed.medida_nombre

JOIN peligro_medidas pm
    ON pm.peligro_id = p.id
   AND pm.medida_preventiva_id = mp.id

JOIN acciones a
    ON a.nombre = seed.accion_nombre

ON CONFLICT DO NOTHING;


-- ============================================================
-- FIN BLOQUE 3A.11-D
-- TODAVÍA NO COLOCAR COMMIT
-- ============================================================

-- ============================================================
-- 11. RELACIONES ACCIÓN -> RECURSOS
-- Riesgos Químicos, Biológicos y Ergonómicos
-- ============================================================

INSERT INTO peligro_medida_accion_recursos
    (peligro_medida_accion_id, recurso_id)

SELECT
    pma.id,
    r.id
FROM (
    VALUES

    -- ========================================================
    -- RIESGO QUÍMICO
    -- ========================================================

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas',
     'Identificar y señalizar las sustancias cancerígenas o mutagénicas',
     'Etiquetas para sustancias químicas'),

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas',
     'Registro de exposición'),

    ('Cancerigenos/Mutagenicos',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas',
     'Verificar el etiquetado correcto de sustancias químicas',
     'Etiquetas para sustancias químicas'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas',
     'Mantener disponibles procedimientos para la atención de derrames químicos',
     'Kit para atención de derrames químicos'),

    ('Corrosivos',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Irritantes',
     'Reducir la exposición a sustancias irritantes',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas',
     'Registro de exposición'),

    ('Irritantes',
     'Mantener ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación',
     'Sistema de ventilación'),

    ('Irritantes',
     'Mantener ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación',
     'Extractor de aire'),

    ('Sensibilizantes',
     'Reducir la exposición a sustancias sensibilizantes',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas',
     'Registro de exposición'),

    ('Sensibilizantes',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Toxicos/Asfixiantes',
     'Garantizar ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación',
     'Sistema de ventilación'),

    ('Toxicos/Asfixiantes',
     'Garantizar ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación',
     'Extractor de aire'),

    ('Toxicos/Asfixiantes',
     'Evitar mezclas incompatibles de productos químicos',
     'Verificar el etiquetado correcto de sustancias químicas',
     'Etiquetas para sustancias químicas'),


    -- ========================================================
    -- RIESGO BIOLÓGICO
    -- ========================================================

    ('Virus',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Material de capacitación'),

    ('Virus',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Bacterias',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Material de capacitación'),

    ('Bacterias',
     'Fortalecer las prácticas de higiene de manos',
     'Supervisar el cumplimiento de higiene de manos',
     'Insumos para higiene de manos'),

    ('Agujas y material punzocortante',
     'Prevenir accidentes con agujas y material punzocortante',
     'Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica',
     'Material de capacitación'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes',
     'Realizar el descarte correcto de objetos punzocortantes',
     'Recipiente rígido para objetos punzocortantes'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes',
     'Verificar la disponibilidad y ubicación de recipientes para objetos punzocortantes',
     'Recipiente rígido para objetos punzocortantes'),

    ('Contacto con microorganismos',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Material de capacitación'),

    ('Contacto con microorganismos',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Contaminación de superficies/equipos',
     'Mantener procedimientos adecuados de limpieza y desinfección',
     'Realizar limpieza y desinfección de superficies y equipos',
     'Material para limpieza y desinfección'),

    ('Convivencia con pacientes infectados',
     'Aplicar medidas de aislamiento según el tipo de transmisión',
     'Capacitar al personal sobre medidas de aislamiento',
     'Material de capacitación'),

    ('Convivencia con pacientes infectados',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Exposicion a sangre y fluidos corporales',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Equipo de protección personal'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental',
     'Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica',
     'Material de capacitación'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental',
     'Mantener disponible el flujograma de atención ante exposición biológica',
     'Flujograma de atención'),

    ('Mala higiene de manos',
     'Fortalecer las prácticas de higiene de manos',
     'Supervisar el cumplimiento de higiene de manos',
     'Insumos para higiene de manos'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios',
     'Verificar la correcta segregación y manejo de residuos hospitalarios',
     'Contenedores para residuos hospitalarios'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios',
     'Reforzar el protocolo de manejo y descarte de material contaminado',
     'Material de capacitación'),

    ('Aerosoles',
     'Reducir la exposición a aerosoles potencialmente contaminados',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Material de capacitación'),

    ('Aerosoles',
     'Utilizar protección respiratoria adecuada',
     'Aplicar medidas de protección respiratoria cuando exista riesgo de aerosoles',
     'Equipo de protección respiratoria'),


    -- ========================================================
    -- RIESGO ERGONÓMICO
    -- ========================================================

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Evaluar el peso y las características de las cargas',
     'Formato de evaluación de condiciones de trabajo'),

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Utilizar ayudas mecánicas para la movilización de cargas',
     'Ayuda mecánica para movilización de cargas'),

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Utilizar ayudas mecánicas para la movilización de cargas',
     'Carro de transporte'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte',
     'Capacitar al personal sobre manipulación segura de cargas',
     'Material de capacitación'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte',
     'Mantener despejadas las rutas de traslado',
     'Señalización de seguridad'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos',
     'Identificar tareas con alta frecuencia de movimientos repetitivos',
     'Formato de evaluación de condiciones de trabajo'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos',
     'Rotar al personal entre actividades cuando sea posible',
     'Cronograma de rotación'),

    ('Movimientos repetitivos',
     'Establecer pausas activas y períodos de recuperación',
     'Implementar pausas activas y períodos de recuperación',
     'Material para pausas activas'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador',
     'Identificar tareas que requieran aplicar fuerza excesiva',
     'Formato de evaluación de condiciones de trabajo'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador',
     'Realizar tareas entre dos o más personas cuando sea necesario',
     'Procedimiento de trabajo seguro'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores',
     'Utilizar técnicas adecuadas de empuje, tracción y movilización',
     'Dispositivo de movilización'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores',
     'Utilizar ayudas mecánicas para la movilización de cargas',
     'Ayuda mecánica para movilización de cargas'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones',
     'Limitar el tiempo de exposición a vibraciones',
     'Rol de turnos'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones',
     'Alternar tareas con exposición a vibraciones',
     'Rol de turnos'),

    ('Vibración',
     'Utilizar equipos y elementos que reduzcan la transmisión de vibraciones',
     'Utilizar elementos que disminuyan la transmisión de vibraciones',
     'Elementos antivibración'),

    ('Vibración',
     'Utilizar equipos y elementos que reduzcan la transmisión de vibraciones',
     'Utilizar elementos que disminuyan la transmisión de vibraciones',
     'Herramientas ergonómicas'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo',
     'Redistribuir actividades cuando exista sobrecarga de trabajo',
     'Rol de turnos'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo',
     'Revisar la organización y distribución del trabajo',
     'Formato de evaluación de condiciones de trabajo'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades',
     'Alternar tareas de diferente exigencia física',
     'Rol de turnos'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades',
     'Implementar pausas activas y períodos de recuperación',
     'Material para pausas activas'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Ajustar la altura y ubicación del mobiliario y equipos',
     'Mobiliario ergonómico'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Reorganizar elementos de uso frecuente para evitar posturas forzadas',
     'Mobiliario ergonómico'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Capacitar al personal sobre higiene postural',
     'Material de capacitación'),

    ('Posturas forzadas o incómodas',
     'Evitar permanecer durante períodos prolongados en una misma posición',
     'Alternar tareas de diferente exigencia física',
     'Rol de turnos')

) AS seed(peligro_nombre, medida_nombre, accion_nombre, recurso_nombre)

JOIN peligros p
    ON p.nombre = seed.peligro_nombre

JOIN medidas_preventivas mp
    ON mp.nombre = seed.medida_nombre

JOIN peligro_medidas pm
    ON pm.peligro_id = p.id
   AND pm.medida_preventiva_id = mp.id

JOIN acciones a
    ON a.nombre = seed.accion_nombre

JOIN peligro_medida_acciones pma
    ON pma.peligro_medida_id = pm.id
   AND pma.accion_id = a.id

JOIN recursos r
    ON r.nombre = seed.recurso_nombre

ON CONFLICT DO NOTHING;


-- ============================================================
-- FIN BLOQUE 3A.11-E
-- TODAVÍA NO COLOCAR COMMIT
-- ============================================================

-- ============================================================
-- 12. RELACIONES ACCIÓN -> RESPONSABLES
-- Riesgos Químicos, Biológicos y Ergonómicos
--
-- Se asigna responsable PRINCIPAL y, cuando corresponde,
-- responsables de APOYO.
-- ============================================================

INSERT INTO peligro_medida_accion_responsables
    (peligro_medida_accion_id, responsable_id, tipo)

SELECT
    pma.id,
    resp.id,
    seed.tipo
FROM (
    VALUES

    -- ========================================================
    -- RIESGO QUÍMICO
    -- ========================================================

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas',
     'Identificar y señalizar las sustancias cancerígenas o mutagénicas',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Cancerigenos/Mutagenicos',
     'Reducir la exposición a sustancias cancerígenas o mutagénicas',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Cancerigenos/Mutagenicos',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas',
     'Verificar el etiquetado correcto de sustancias químicas',
     'Responsable del Área',
     'PRINCIPAL'),

    ('Corrosivos',
     'Evitar el contacto directo con sustancias corrosivas',
     'Mantener disponibles procedimientos para la atención de derrames químicos',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Corrosivos',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Irritantes',
     'Reducir la exposición a sustancias irritantes',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Irritantes',
     'Mantener ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación',
     'Mantenimiento',
     'PRINCIPAL'),

    ('Sensibilizantes',
     'Reducir la exposición a sustancias sensibilizantes',
     'Limitar el tiempo de exposición a sustancias químicas peligrosas',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Sensibilizantes',
     'Utilizar equipo de protección personal adecuado',
     'Verificar el uso correcto del equipo de protección personal',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Toxicos/Asfixiantes',
     'Garantizar ventilación adecuada en áreas donde se utilizan productos químicos',
     'Verificar periódicamente el funcionamiento de los sistemas de ventilación',
     'Mantenimiento',
     'PRINCIPAL'),

    ('Toxicos/Asfixiantes',
     'Evitar mezclas incompatibles de productos químicos',
     'Verificar el etiquetado correcto de sustancias químicas',
     'Responsable del Área',
     'PRINCIPAL'),


    -- ========================================================
    -- RIESGO BIOLÓGICO
    -- ========================================================

    ('Virus',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Virus',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Bacterias',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Bacterias',
     'Fortalecer las prácticas de higiene de manos',
     'Supervisar el cumplimiento de higiene de manos',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Agujas y material punzocortante',
     'Prevenir accidentes con agujas y material punzocortante',
     'Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica',
     'Salud Ocupacional',
     'PRINCIPAL'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes',
     'Realizar el descarte correcto de objetos punzocortantes',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Agujas y material punzocortante',
     'Garantizar el descarte seguro de objetos punzocortantes',
     'Verificar la disponibilidad y ubicación de recipientes para objetos punzocortantes',
     'Responsable del Área',
     'PRINCIPAL'),

    ('Contacto con microorganismos',
     'Aplicar precauciones estándar para prevenir la exposición a agentes biológicos',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Contacto con microorganismos',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Contaminación de superficies/equipos',
     'Mantener procedimientos adecuados de limpieza y desinfección',
     'Realizar limpieza y desinfección de superficies y equipos',
     'Responsable del Área',
     'PRINCIPAL'),

    ('Convivencia con pacientes infectados',
     'Aplicar medidas de aislamiento según el tipo de transmisión',
     'Capacitar al personal sobre medidas de aislamiento',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Convivencia con pacientes infectados',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Exposicion a sangre y fluidos corporales',
     'Utilizar equipo de protección personal según el nivel de exposición',
     'Verificar el uso correcto del equipo de protección personal',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental',
     'Capacitar al personal sobre el protocolo de accidente laboral con exposición biológica',
     'Salud Ocupacional',
     'PRINCIPAL'),

    ('Exposicion a sangre y fluidos corporales',
     'Mantener protocolos de actuación ante exposición biológica accidental',
     'Mantener disponible el flujograma de atención ante exposición biológica',
     'Salud Ocupacional',
     'PRINCIPAL'),

    ('Mala higiene de manos',
     'Fortalecer las prácticas de higiene de manos',
     'Supervisar el cumplimiento de higiene de manos',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios',
     'Verificar la correcta segregación y manejo de residuos hospitalarios',
     'Responsable del Área',
     'PRINCIPAL'),

    ('Residuos hospitalarios',
     'Garantizar el manejo y segregación adecuada de residuos hospitalarios',
     'Reforzar el protocolo de manejo y descarte de material contaminado',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Aerosoles',
     'Reducir la exposición a aerosoles potencialmente contaminados',
     'Reforzar periódicamente los protocolos de prevención de infecciones',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Aerosoles',
     'Utilizar protección respiratoria adecuada',
     'Aplicar medidas de protección respiratoria cuando exista riesgo de aerosoles',
     'Jefe del Servicio',
     'PRINCIPAL'),


    -- ========================================================
    -- RIESGO ERGONÓMICO
    -- ========================================================

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Evaluar el peso y las características de las cargas',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Manipulación manual de cargas',
     'Evitar la manipulación manual innecesaria de cargas',
     'Utilizar ayudas mecánicas para la movilización de cargas',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte',
     'Capacitar al personal sobre manipulación segura de cargas',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Manipulación manual de cargas',
     'Aplicar técnicas adecuadas de levantamiento y transporte',
     'Mantener despejadas las rutas de traslado',
     'Responsable del Área',
     'PRINCIPAL'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos',
     'Identificar tareas con alta frecuencia de movimientos repetitivos',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Movimientos repetitivos',
     'Alternar actividades y reducir la repetición continua de movimientos',
     'Rotar al personal entre actividades cuando sea posible',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Movimientos repetitivos',
     'Establecer pausas activas y períodos de recuperación',
     'Implementar pausas activas y períodos de recuperación',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador',
     'Identificar tareas que requieran aplicar fuerza excesiva',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Fuerza excesiva',
     'Evitar esfuerzos superiores a las capacidades del trabajador',
     'Realizar tareas entre dos o más personas cuando sea necesario',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores',
     'Utilizar técnicas adecuadas de empuje, tracción y movilización',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Fuerza excesiva',
     'Utilizar ayudas mecánicas o apoyo de otros colaboradores',
     'Utilizar ayudas mecánicas para la movilización de cargas',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones',
     'Limitar el tiempo de exposición a vibraciones',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Vibración',
     'Reducir el tiempo de exposición a vibraciones',
     'Alternar tareas con exposición a vibraciones',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Vibración',
     'Utilizar equipos y elementos que reduzcan la transmisión de vibraciones',
     'Utilizar elementos que disminuyan la transmisión de vibraciones',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo',
     'Redistribuir actividades cuando exista sobrecarga de trabajo',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Organizar las tareas procurando una distribución equilibrada de la carga de trabajo',
     'Revisar la organización y distribución del trabajo',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades',
     'Alternar tareas de diferente exigencia física',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Duración, intensidad y frecuencia de las tareas',
     'Establecer pausas y alternancia de actividades',
     'Implementar pausas activas y períodos de recuperación',
     'Jefe del Servicio',
     'PRINCIPAL'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Ajustar la altura y ubicación del mobiliario y equipos',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Reorganizar elementos de uso frecuente para evitar posturas forzadas',
     'Responsable del Área',
     'PRINCIPAL'),

    ('Posturas forzadas o incómodas',
     'Adecuar el puesto de trabajo y favorecer posturas neutrales',
     'Capacitar al personal sobre higiene postural',
     'Seguridad y Salud Ocupacional',
     'PRINCIPAL'),

    ('Posturas forzadas o incómodas',
     'Evitar permanecer durante períodos prolongados en una misma posición',
     'Alternar tareas de diferente exigencia física',
     'Jefe del Servicio',
     'PRINCIPAL')

) AS seed(
    peligro_nombre,
    medida_nombre,
    accion_nombre,
    responsable_nombre,
    tipo
)

JOIN peligros p
    ON p.nombre = seed.peligro_nombre

JOIN medidas_preventivas mp
    ON mp.nombre = seed.medida_nombre

JOIN peligro_medidas pm
    ON pm.peligro_id = p.id
   AND pm.medida_preventiva_id = mp.id

JOIN acciones a
    ON a.nombre = seed.accion_nombre

JOIN peligro_medida_acciones pma
    ON pma.peligro_medida_id = pm.id
   AND pma.accion_id = a.id

JOIN responsables resp
    ON resp.nombre = seed.responsable_nombre

ON CONFLICT DO NOTHING;


-- ============================================================
-- FIN BLOQUE 3A.11-F
-- TODAVÍA NO COLOCAR COMMIT
-- ============================================================
-- ============================================================
-- CIERRE TRANSACCIONAL
-- ============================================================

COMMIT;