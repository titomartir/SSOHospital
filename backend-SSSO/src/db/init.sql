-- Catálogo de Sub Direcciones
CREATE TABLE IF NOT EXISTS sub_direcciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de Departamentos (Catálogos)
CREATE TABLE IF NOT EXISTS departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    sub_direccion_id INT NOT NULL REFERENCES sub_direcciones(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Catálogo de Servicios
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    departamento_id INT NOT NULL REFERENCES departamentos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (departamento_id, nombre)
);

-- Catálogo de Riesgos
CREATE TABLE IF NOT EXISTS riesgos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Catálogo de Peligros
CREATE TABLE IF NOT EXISTS peligros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) UNIQUE NOT NULL,
    riesgo_id INT NOT NULL REFERENCES riesgos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de Matriz de Riesgos
CREATE TABLE IF NOT EXISTS matriz_riesgos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    sub_direccion_id INT NOT NULL REFERENCES sub_direcciones(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    departamento_id INT NOT NULL REFERENCES departamentos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    servicio_id INT NOT NULL REFERENCES servicios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    puesto VARCHAR(100),
    ubicacion VARCHAR(150) NOT NULL,
    peligro_id INT NOT NULL REFERENCES peligros(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    riesgo_id INT NOT NULL REFERENCES riesgos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
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

-- Insertar Datos Semilla de Sub Direcciones
INSERT INTO sub_direcciones (nombre) VALUES
('Servicios Generales'),
('Recursos Humanos'),
('Administrativo - Financiera'),
('Médica'),
('Enfermería'),
('Técnica')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Datos Semilla de Departamentos
INSERT INTO departamentos (nombre, sub_direccion_id) VALUES
('Emergencias', (SELECT id FROM sub_direcciones WHERE nombre = 'Médica')),
('UCI', (SELECT id FROM sub_direcciones WHERE nombre = 'Médica')),
('Laboratorio', (SELECT id FROM sub_direcciones WHERE nombre = 'Técnica')),
('Mantenimiento', (SELECT id FROM sub_direcciones WHERE nombre = 'Servicios Generales')),
('Farmacia', (SELECT id FROM sub_direcciones WHERE nombre = 'Administrativo - Financiera'))
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Datos Semilla de Servicios
INSERT INTO servicios (nombre, departamento_id) VALUES
('Triage', (SELECT id FROM departamentos WHERE nombre = 'Emergencias')),
('Atención de urgencias', (SELECT id FROM departamentos WHERE nombre = 'Emergencias')),
('Cuidados críticos', (SELECT id FROM departamentos WHERE nombre = 'UCI')),
('Procesamiento de muestras', (SELECT id FROM departamentos WHERE nombre = 'Laboratorio')),
('Mantenimiento eléctrico', (SELECT id FROM departamentos WHERE nombre = 'Mantenimiento')),
('Dispensación', (SELECT id FROM departamentos WHERE nombre = 'Farmacia'))
ON CONFLICT (departamento_id, nombre) DO NOTHING;

-- Insertar Datos Semilla de Riesgos
INSERT INTO riesgos (nombre) VALUES
('Riesgo Químico'),
('Riesgo Biológico')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Datos Semilla de Peligros
INSERT INTO peligros (nombre, riesgo_id) VALUES
('Cancerigenos/Mutagenicos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Corrosivos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Irritantes', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Sensibilizantes', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Toxicos/Asfixiantes', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico')),
('Virus', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico')),
('Bacterias', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico')),
('Hongos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico')),
('Parásitos', (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico'))
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Datos Semilla de Matriz de Riesgos
INSERT INTO matriz_riesgos (id, fecha, sub_direccion_id, departamento_id, servicio_id, puesto, ubicacion, peligro_id, riesgo_id, probabilidad, consecuencia, nivel, clasificacion, medidas_prev, observaciones) VALUES
(1, '2024-01-15', (SELECT id FROM sub_direcciones WHERE nombre = 'Médica'), (SELECT id FROM departamentos WHERE nombre = 'Emergencias'), (SELECT id FROM servicios WHERE nombre = 'Triage' AND departamento_id = (SELECT id FROM departamentos WHERE nombre = 'Emergencias')), 'Enfermero/a', 'Área de triage', (SELECT id FROM peligros WHERE nombre = 'Virus'), (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico'), 4, 5, 20, 'Muy alto', 'Uso obligatorio de EPP, protocolo de bioseguridad, vacunación', ''),
(2, '2024-01-20', (SELECT id FROM sub_direcciones WHERE nombre = 'Médica'), (SELECT id FROM departamentos WHERE nombre = 'UCI'), (SELECT id FROM servicios WHERE nombre = 'Cuidados críticos' AND departamento_id = (SELECT id FROM departamentos WHERE nombre = 'UCI')), 'Médico intensivista', 'Sala de aislamiento', (SELECT id FROM peligros WHERE nombre = 'Bacterias'), (SELECT id FROM riesgos WHERE nombre = 'Riesgo Biológico'), 4, 4, 16, 'Muy alto', 'Mascarilla N95, barreras físicas, ventilación asistida', ''),
(3, '2024-02-05', (SELECT id FROM sub_direcciones WHERE nombre = 'Técnica'), (SELECT id FROM departamentos WHERE nombre = 'Laboratorio'), (SELECT id FROM servicios WHERE nombre = 'Procesamiento de muestras' AND departamento_id = (SELECT id FROM departamentos WHERE nombre = 'Laboratorio')), 'Técnico de laboratorio', 'Área de muestras', (SELECT id FROM peligros WHERE nombre = 'Corrosivos'), (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico'), 3, 3, 9, 'Medio', 'Guantes, gafas y campana extractora', ''),
(4, '2024-02-11', (SELECT id FROM sub_direcciones WHERE nombre = 'Servicios Generales'), (SELECT id FROM departamentos WHERE nombre = 'Mantenimiento'), (SELECT id FROM servicios WHERE nombre = 'Mantenimiento eléctrico' AND departamento_id = (SELECT id FROM departamentos WHERE nombre = 'Mantenimiento')), 'Técnico eléctrico', 'Tableros principales', (SELECT id FROM peligros WHERE nombre = 'Corrosivos'), (SELECT id FROM riesgos WHERE nombre = 'Riesgo Químico'), 2, 5, 10, 'Medio', 'Bloqueo-etiquetado, herramientas aisladas', '')
ON CONFLICT (id) DO NOTHING;

-- Insertar Datos Semilla de Planificaciones
INSERT INTO planificaciones (id, evaluacion_id, medida, fecha_cumplimiento, responsable, estado) VALUES
(1, 1, 'Capacitación en bioseguridad', '2024-03-20', 'Jefe de Enfermería', 'en proceso'),
(2, 3, 'Revisión de campana extractora', '2024-03-28', 'Coordinación de Laboratorio', 'pendiente')
ON CONFLICT (id) DO NOTHING;

-- Ajustar los generadores de secuencia para PostgreSQL después de insertar registros con IDs específicos
SELECT setval('sub_direcciones_id_seq', COALESCE((SELECT MAX(id)+1 FROM sub_direcciones), 1), false);
SELECT setval('departamentos_id_seq', COALESCE((SELECT MAX(id)+1 FROM departamentos), 1), false);
SELECT setval('servicios_id_seq', COALESCE((SELECT MAX(id)+1 FROM servicios), 1), false);
SELECT setval('riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM riesgos), 1), false);
SELECT setval('peligros_id_seq', COALESCE((SELECT MAX(id)+1 FROM peligros), 1), false);
SELECT setval('matriz_riesgos_id_seq', COALESCE((SELECT MAX(id)+1 FROM matriz_riesgos), 1), false);
SELECT setval('planificaciones_id_seq', COALESCE((SELECT MAX(id)+1 FROM planificaciones), 1), false);
