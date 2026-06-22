-- Tabla de Departamentos (Catálogos)
CREATE TABLE IF NOT EXISTS departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- Catálogo de Riesgos
CREATE TABLE IF NOT EXISTS riesgos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) UNIQUE NOT NULL
);

-- Tabla de Matriz de Riesgos
CREATE TABLE IF NOT EXISTS matriz_riesgos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    departamento VARCHAR(100) NOT NULL REFERENCES departamentos(nombre) ON UPDATE CASCADE ON DELETE RESTRICT,
    puesto VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    actividad TEXT NOT NULL,
    peligro TEXT NOT NULL,
    riesgo TEXT NOT NULL,
    probabilidad INT NOT NULL CHECK (probabilidad BETWEEN 1 AND 5),
    consecuencia INT NOT NULL CHECK (consecuencia BETWEEN 1 AND 5),
    nivel INT NOT NULL,
    clasificacion VARCHAR(20) NOT NULL,
    medidas_prev TEXT NOT NULL,
    observaciones TEXT
);

-- Tabla de Planificaciones Preventivas
CREATE TABLE IF NOT EXISTS planificaciones (
    id SERIAL PRIMARY KEY,
    evaluacion_id INT NOT NULL REFERENCES matriz_riesgos(id) ON DELETE CASCADE,
    medida TEXT NOT NULL,
    fecha_cumplimiento DATE NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en proceso', 'completado'))
);

-- Insertar Datos Semilla de Departamentos
INSERT INTO departamentos (nombre) VALUES 
('Emergencias'), 
('UCI'), 
('Laboratorio'), 
('Mantenimiento'), 
('Farmacia')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Datos Semilla de Riesgos
INSERT INTO riesgos (nombre) VALUES
('Contagio de VIH, Hepatitis B y C'),
('Infecciones respiratorias ocupacionales'),
('Irritación dérmica y respiratoria'),
('Descarga eléctrica')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Datos Semilla de Matriz de Riesgos
INSERT INTO matriz_riesgos (id, fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo, probabilidad, consecuencia, nivel, clasificacion, medidas_prev, observaciones) VALUES
(1, '2024-01-15', 'Emergencias', 'Enfermero/a', 'Área de triage', 'Atención directa a pacientes', 'Exposición a fluidos biológicos', 'Contagio de VIH, Hepatitis B y C', 4, 5, 20, 'Muy alto', 'Uso obligatorio de EPP, protocolo de bioseguridad, vacunación', ''),
(2, '2024-01-20', 'UCI', 'Médico intensivista', 'Sala de aislamiento', 'Procedimientos invasivos', 'Aerosoles infecciosos', 'Infecciones respiratorias ocupacionales', 4, 4, 16, 'Muy alto', 'Mascarilla N95, barreras físicas, ventilación asistida', ''),
(3, '2024-02-05', 'Laboratorio', 'Técnico de laboratorio', 'Área de muestras', 'Procesamiento de muestras biológicas', 'Contacto con reactivos químicos', 'Irritación dérmica y respiratoria', 3, 3, 9, 'Medio', 'Guantes, gafas y campana extractora', ''),
(4, '2024-02-11', 'Mantenimiento', 'Técnico eléctrico', 'Tableros principales', 'Inspección de instalaciones', 'Riesgo eléctrico', 'Descarga eléctrica', 2, 5, 10, 'Medio', 'Bloqueo-etiquetado, herramientas aisladas', '')
ON CONFLICT (id) DO NOTHING;

-- Insertar Datos Semilla de Planificaciones
INSERT INTO planificaciones (id, evaluacion_id, medida, fecha_cumplimiento, responsable, estado) VALUES
(1, 1, 'Capacitación en bioseguridad', '2024-03-20', 'Jefe de Enfermería', 'en proceso'),
(2, 3, 'Revisión de campana extractora', '2024-03-28', 'Coordinación de Laboratorio', 'pendiente')
ON CONFLICT (id) DO NOTHING;

-- Ajustar los generadores de secuencia para PostgreSQL después de insertar registros con IDs específicos
SELECT setval('departamentos_id_seq', COALESCE((SELECT MAX(id)+1 FROM departamentos), 1), false);
SELECT setval('riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM riesgos), 1), false);
SELECT setval('matriz_riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM matriz_riesgos), 1), false);
SELECT setval('planificaciones_id_seq', COALESCE((SELECT MAX(id)+1 FROM planificaciones), 1), false);
