# Backend

## Stack
- Node.js (ESM)
- Express 5
- pg
- dotenv
- cors

## Bootstrap
- Entry: backend-SSSO/server.js
- Middlewares:
  - cors()
  - express.json()
- API mounted under /api/*.
- Health endpoint: /api/health.

## Folder Responsibilities
- src/routes: endpoint registration.
- src/controllers: request-level validation and response mapping.
- src/models: SQL and persistence logic.
- src/db: connection and migrations.
- src/utils: shared calculations.

## Controllers Overview
- CRUD controllers for:
  - subDireccion
  - departamento
  - servicio
  - puesto
  - funcion
  - riesgo
  - peligro
  - medidaPreventiva
  - accion
  - recurso
  - responsable
  - planificacion
  - matriz
- Tree controllers:
  - catalogoEstructuraController
  - catalogoPuestoFuncionController
  - catalogoRiesgoPeligroController
- Analytics:
  - dashboardController

## Validation Behavior
Common patterns:
- Required fields checked in controllers with 400 responses.
- Referential integrity conflicts surfaced as 409 in selected delete paths.
- matrizModel performs deeper payload validation and raises VALIDATION_ERROR (mapped to 400).

## Matrix Business Logic
Implemented mainly in matrizModel:
- Backward-compatible payload normalization:
  - normalizeFunciones
  - normalizeRiesgos
- Validation:
  - minimum one function
  - minimum one risk per function
  - required risk detail fields
- Transactional create/update:
  - BEGIN / COMMIT / ROLLBACK
  - insert/update matriz_evaluaciones
  - replace child entries in matriz_evaluacion_funciones and matriz_evaluacion_detalles
- Read helpers:
  - fetchSummaryById
  - fetchDetailById

## Dashboard Business Logic
Implemented in dashboardModel:
- Dynamic filter builder for evaluation-level and detail-level conditions.
- Single SQL CTE-based aggregate query returns:
  - KPIs
  - 14 chart datasets
  - filterOptions

## Error Handling
- Controllers log errors to console and return user-facing JSON error messages.
- No centralized error middleware exists currently.

## Middleware State
- No custom middleware directory currently present.
- No auth/authorization middleware in request pipeline.

## ORM / Repository
- No ORM currently used.
- Direct SQL in model layer.

## Testing State
- No automated test framework configured.
- Manual DB connectivity scripts exist:
  - test-db.js
  - test-db2.js

## Backend Risks / Debt
- Error handling and validation are distributed, not centralized.
- No rate limiting, auth middleware, or input schema validation library.
- Legacy and modern matrix schemas coexist in migration history.

## Phase 3A Status
- Implemented in backend:
  - CRUD /api/medidas-preventivas
  - CRUD /api/acciones
  - CRUD /api/recursos
  - CRUD /api/responsables
- Not implemented in this phase:
  - Frontend integration for the four new catalogs.
  - matrizModel.js transition logic to consume *_id columns.

## Phase 4A Cross-Status
- Frontend integration for the four independent catalogs is now implemented in Catalogos module.
- Matrix backend flow remains unchanged and still supports legacy text fields.
- FK columns in `matriz_evaluacion_detalles` are available but not yet consumed by matrix frontend/backend payload flow in this phase.

## Cross References
- Endpoint catalog: API.md
- Data model and migrations: DATABASE.md
- Runtime setup: DEVOPS.md
- Security posture: SECURITY.md
