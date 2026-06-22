# Plan de Implementación: Conexión de Frontend y Backend para SSOHospital (Local Docker Setup)

Este documento contiene un diagnóstico detallado del estado actual del proyecto **SSOHospital** y un plan paso a paso para lograr que funcione de manera integrada con una base de datos PostgreSQL local y pgAdmin utilizando Docker.

---

## 🔍 Diagnóstico del Proyecto

Actualmente, el proyecto está dividido en dos partes (`SSO` y `backend-SSSO`), pero se encuentra **desconectado** y le faltan componentes esenciales para poder funcionar.

### 1. Diagnóstico del Backend (`backend-SSSO`)
* **Base de datos inexistente:** No hay scripts SQL ni de migración en la base de datos PostgreSQL.
* **Conexión remota fallida:** La IP actual de la base de datos apunta a `192.168.10.253` y la contraseña en `.env` da un error de autenticación.
* **Carpetas vacías:** Las carpetas `src/controllers/`, `src/models/` y `src/routes/` están completamente vacías. El servidor solo tiene una ruta de prueba `/api/health`.
* **Falta de Docker Compose:** No existe archivo `docker-compose.yml` para instanciar localmente la base de datos y pgAdmin de manera autónoma.

### 2. Diagnóstico del Frontend (`SSO`)
* **Dependencias no instaladas:** La carpeta `node_modules` no existe en la raíz del frontend. No es posible iniciar el cliente sin ejecutar primero `npm install`.
* **Servicios Mockeados:** Los servicios (`matrizService.js`, `planificacionService.js`, `catalogoService.js`) operan completamente en memoria con un retraso simulado y persisten usando únicamente el `localStorage` de manera ineficiente y propensa a desincronización.
* **Configuración del Servidor de Desarrollo:** El archivo `vite.config.js` no cuenta con un proxy configurado para redirigir las peticiones de `/api/*` al servidor Express en el puerto `3000`.

---

## 🛠️ Plan de Implementación

Hemos adaptado el plan para realizar una **conexión local de PostgreSQL con pgAdmin mediante Docker**.

### Fase 1: Configuración de Base de Datos Local (Docker)

1. Crearemos el archivo `docker-compose.yml` en la raíz del backend para automatizar la creación del contenedor PostgreSQL y pgAdmin.
2. Modificaremos el archivo `.env` del backend para conectarse a `localhost` con las credenciales locales seguras.
3. Crearemos un script SQL de inicialización (`src/db/init.sql`) para estructurar las tablas y cargar datos semilla.

#### Configuración de `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: sso_postgres_db
    restart: always
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: CAMBIAR_POR_PASSWORD_SEGURA_123!@#
      POSTGRES_DB: SSO
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: sso_pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - db

volumes:
  postgres_data:
```

#### Estructura de Tablas (`src/db/init.sql`):
```sql
-- Tabla de Departamentos (Catálogos)
CREATE TABLE IF NOT EXISTS departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
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

-- Insertar Datos Semilla
INSERT INTO departamentos (nombre) VALUES 
('Emergencias'), ('UCI'), ('Laboratorio'), ('Mantenimiento'), ('Farmacia')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO matriz_riesgos (id, fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo, probabilidad, consecuencia, nivel, clasificacion, medidas_prev, observaciones) VALUES
(1, '2024-01-15', 'Emergencias', 'Enfermero/a', 'Área de triage', 'Atención directa a pacientes', 'Exposición a fluidos biológicos', 'Contagio de VIH, Hepatitis B y C', 4, 5, 20, 'Muy alto', 'Uso obligatorio de EPP, protocolo de bioseguridad, vacunación', ''),
(2, '2024-01-20', 'UCI', 'Médico intensivista', 'Sala de aislamiento', 'Procedimientos invasivos', 'Aerosoles infecciosos', 'Infecciones respiratorias ocupacionales', 4, 4, 16, 'Muy alto', 'Mascarilla N95, barreras físicas, ventilación asistida', ''),
(3, '2024-02-05', 'Laboratorio', 'Técnico de laboratorio', 'Área de muestras', 'Procesamiento de muestras biológicas', 'Contacto con reactivos químicos', 'Irritación dérmica y respiratoria', 3, 3, 9, 'Medio', 'Guantes, gafas y campana extractora', ''),
(4, '2024-02-11', 'Mantenimiento', 'Técnico eléctrico', 'Tableros principales', 'Inspección de instalaciones', 'Riesgo eléctrico', 'Descarga eléctrica', 2, 5, 10, 'Medio', 'Bloqueo-etiquetado, herramientas aisladas', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO planificaciones (id, evaluacion_id, medida, fecha_cumplimiento, responsable, estado) VALUES
(1, 1, 'Capacitación en bioseguridad', '2024-03-20', 'Jefe de Enfermería', 'en proceso'),
(2, 3, 'Revisión de campana extractora', '2024-03-28', 'Coordinación de Laboratorio', 'pendiente')
ON CONFLICT (id) DO NOTHING;
```

---

### Fase 2: Desarrollo del Backend REST API

Implementaremos el backend para exponer las operaciones CRUD completas y mapearemos las respuestas de la base de datos de `snake_case` a `camelCase` para mantener total compatibilidad con el frontend React sin alterar sus componentes de presentación.

1. **Modelos (`src/models/`):**
   * `departamentoModel.js`: Operaciones de catálogo.
   * `matrizModel.js`: CRUD completo de evaluaciones.
   * `planificacionModel.js`: CRUD completo de planificación.
2. **Controladores (`src/controllers/`):**
   * Controladores respectivos para procesar peticiones y enviar JSON formateado.
3. **Rutas (`src/routes/`):**
   * Rutas REST montadas en `/api/departamentos`, `/api/matriz` y `/api/planificacion`.
4. **Servidor (`server.js`):**
   * Importar y registrar los enrutadores en la app Express.

---

### Fase 3: Integración en el Frontend

1. **Proxy de Vite:** Modificar `vite.config.js` para proxy hacia `http://localhost:3000`.
2. **Servicios de API:** Reemplazar implementaciones simuladas de `catalogoService.js`, `matrizService.js`, y `planificacionService.js` por peticiones Axios reales.
3. **Contexto de Datos (`DataContext.jsx`):**
   * Cambiar `useLocalStorage` a `useState` tradicional.
   * Modificar métodos de guardar/editar para llamar a las APIs.

---

## 📋 Lista de Cambios Propuestos

### [Backend]
#### [NEW] [docker-compose.yml](file:///c:/SSOHospital/backend-SSSO/docker-compose.yml)
#### [NEW] [init.sql](file:///c:/SSOHospital/backend-SSSO/src/db/init.sql)
#### [NEW] [departamentoModel.js](file:///c:/SSOHospital/backend-SSSO/src/models/departamentoModel.js)
#### [NEW] [matrizModel.js](file:///c:/SSOHospital/backend-SSSO/src/models/matrizModel.js)
#### [NEW] [planificacionModel.js](file:///c:/SSOHospital/backend-SSSO/src/models/planificacionModel.js)
#### [NEW] [departamentoController.js](file:///c:/SSOHospital/backend-SSSO/src/controllers/departamentoController.js)
#### [NEW] [matrizController.js](file:///c:/SSOHospital/backend-SSSO/src/controllers/matrizController.js)
#### [NEW] [planificacionController.js](file:///c:/SSOHospital/backend-SSSO/src/controllers/planificacionController.js)
#### [NEW] [departamentoRoutes.js](file:///c:/SSOHospital/backend-SSSO/src/routes/departamentoRoutes.js)
#### [NEW] [matrizRoutes.js](file:///c:/SSOHospital/backend-SSSO/src/routes/matrizRoutes.js)
#### [NEW] [planificacionRoutes.js](file:///c:/SSOHospital/backend-SSSO/src/routes/planificacionRoutes.js)
#### [MODIFY] [.env](file:///c:/SSOHospital/backend-SSSO/.env)
#### [MODIFY] [server.js](file:///c:/SSOHospital/backend-SSSO/server.js)

### [Frontend]
#### [MODIFY] [vite.config.js](file:///c:/SSOHospital/SSO/vite.config.js)
#### [MODIFY] [catalogoService.js](file:///c:/SSOHospital/SSO/src/services/catalogoService.js)
#### [MODIFY] [matrizService.js](file:///c:/SSOHospital/SSO/src/services/matrizService.js)
#### [MODIFY] [planificacionService.js](file:///c:/SSOHospital/SSO/src/services/planificacionService.js)
#### [MODIFY] [DataContext.jsx](file:///c:/SSOHospital/SSO/src/context/DataContext.jsx)

---

## Estado de implementación (actualizado)

| Fase | Estado | Notas |
|------|--------|-------|
| Fase 1: Docker + PostgreSQL | Completada | `docker-compose.yml`, `init.sql`, credenciales sincronizadas en `.env` |
| Fase 2: Backend REST API | Completada | Modelos, controladores y rutas CRUD operativos |
| Fase 3: Integración Frontend | Completada | Proxy Vite, servicios Axios, `DataContext` con API real |

### Cómo ejecutar el proyecto

```bash
# 1. Base de datos (desde backend-SSSO)
npm run docker:up

# 2. Si es la primera vez o la BD está vacía:
npm run db:init

# 3. Verificar conexión
npm run db:test

# 4. Backend
npm run dev

# 5. Frontend (desde SSO, en otra terminal)
npm install
npm run dev
```

- **PostgreSQL:** `localhost:5433` (usuario `appuser`, BD `SSO`)
- **pgAdmin:** http://localhost:5050 (`admin@admin.com` / `admin123`)
- **API:** http://localhost:3000/api/health
- **Frontend:** http://localhost:5173

### Pruebas de Configuración Inicial
1. **Docker Compose:** Ejecutar `docker compose up -d` en `backend-SSSO` para levantar PostgreSQL y pgAdmin.
2. **Inicialización Base de Datos:** Cargar el script `init.sql` a través de pgAdmin (http://localhost:5050) o vía terminal usando `docker exec`.
3. **Instalación Frontend:** Ejecutar `npm install` en el directorio `SSO`.
4. **Validación de Conexión:** Ejecutar `node test-db.js` en el backend para comprobar que se conecta exitosamente a `localhost`.

### Verificación Manual
1. **Lanzar Servidores:**
   * Backend: Ejecutar `npm run dev` en `backend-SSSO` (se ejecuta en puerto 3000).
   * Frontend: Ejecutar `npm run dev` en `SSO` (se ejecuta en puerto 5173).
2. **Pruebas en UI:**
   * Cargar el dashboard y constatar que renderiza gráficos con los datos semilla del Docker.
   * Crear/Editar/Eliminar registros de la matriz de riesgos y verificar la persistencia refrescando la página.
   * Consultar en pgAdmin (base `SSO`, tablas `departamentos`, `matriz_riesgos`, `planificaciones`) que los cambios se hayan guardado en la base de datos local.
