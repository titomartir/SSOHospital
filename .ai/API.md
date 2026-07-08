# API Documentation

## Base
- Base URL (dev): http://localhost:3000
- Prefix: /api
- Content type: application/json
- Auth: currently none enforced in backend routes.

## Health
| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| GET | /api/health | API health check | 200 |

## Catalog Endpoints

### Sub-direcciones
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/sub-direcciones | - | - | 200 | 500 |
| POST | /api/sub-direcciones | - | nombre | 201 | 400, 500 |
| PUT | /api/sub-direcciones/:id | path id | nombre | 200 | 400, 404, 500 |
| DELETE | /api/sub-direcciones/:id | path id | - | 200 | 409, 500 |

### Departamentos
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/departamentos | - | - | 200 | 500 |
| POST | /api/departamentos | - | nombre, subDireccionId | 201 | 400, 500 |
| PUT | /api/departamentos/:id | path id | nombre, subDireccionId | 200 | 400, 404, 500 |
| DELETE | /api/departamentos/id/:id | path id | - | 200 | 409, 500 |
| DELETE | /api/departamentos/:nombre | path nombre | - | 200 | 500 |

### Servicios
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/servicios | query departamentoId | - | 200 | 400, 500 |
| POST | /api/servicios | - | nombre, departamentoId | 201 | 400, 500 |
| PUT | /api/servicios/:id | path id | nombre, departamentoId | 200 | 400, 404, 500 |
| DELETE | /api/servicios/:id | path id | - | 200 | 409, 500 |

### Puestos
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/puestos | - | - | 200 | 500 |
| POST | /api/puestos | - | nombre, servicioId | 201 | 400, 500 |
| PUT | /api/puestos/:id | path id | nombre, servicioId | 200 | 400, 404, 500 |
| DELETE | /api/puestos/:id | path id | - | 200 | 409, 500 |

### Funciones
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/funciones | query puestoId | - | 200 | 400, 500 |
| POST | /api/funciones | - | nombre, puestoId | 201 | 400, 500 |
| PUT | /api/funciones/:id | path id | nombre, puestoId | 200 | 400, 404, 500 |
| DELETE | /api/funciones/:id | path id | - | 200 | 500 |

### Riesgos
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/riesgos | - | - | 200 | 500 |
| POST | /api/riesgos | - | nombre | 201 | 400, 500 |
| PUT | /api/riesgos/:id | path id | nombre | 200 | 400, 404, 500 |
| DELETE | /api/riesgos/id/:id | path id | - | 200 | 409, 500 |
| DELETE | /api/riesgos/:nombre | path nombre | - | 200 | 409, 500 |

### Peligros
| Method | Endpoint | Params | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | /api/peligros | optional query riesgoId | - | 200 | 500 |
| POST | /api/peligros | - | nombre, riesgoId | 201 | 400, 500 |
| PUT | /api/peligros/:id | path id | nombre, riesgoId | 200 | 400, 404, 500 |
| DELETE | /api/peligros/id/:id | path id | - | 200 | 409, 500 |
| DELETE | /api/peligros/:nombre | path nombre | - | 200 | 409, 500 |

### Tree Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/catalogo-estructura | Tree: sub-direccion -> departamento -> servicio -> puesto -> funcion |
| GET | /api/catalogo-puesto-funcion | Tree: puesto -> funciones |
| GET | /api/catalogo-riesgo-peligro | Tree: riesgo -> peligros |

## Matrix Endpoints
| Method | Endpoint | Purpose | Success | Errors |
|---|---|---|---|---|
| GET | /api/matriz | List matrix evaluations summary | 200 | 500 |
| GET | /api/matriz/:id | Get one evaluation with funciones + riesgosAsociados | 200 | 404, 500 |
| POST | /api/matriz | Create evaluation (transactional) | 201 | 400 validation, 500 |
| PUT | /api/matriz/:id | Update evaluation (transactional) | 200 | 400 validation, 404, 500 |
| DELETE | /api/matriz/:id | Delete evaluation | 200 | 500 |

### Matrix Payload Notes
Expected high-level fields include:
- fecha, subDireccionId, departamentoId, servicioId, puestoId, ubicacion, estado, observaciones.
- funciones[] where each item has:
  - funcionId
  - riesgosAsociados[] with riesgoId, peligroId, probabilidad, consecuencia, medidasPrev, acciones, recursos, fechaCumplimiento, responsable, estado.

## Planificacion Endpoints
| Method | Endpoint | Success | Errors |
|---|---|---|---|
| GET | /api/planificacion | 200 | 500 |
| POST | /api/planificacion | 201 | 500 |
| PUT | /api/planificacion/:id | 200 | 404, 500 |
| DELETE | /api/planificacion/:id | 200 | 500 |

## Dashboard Endpoint
| Method | Endpoint | Query params | Success | Errors |
|---|---|---|---|---|
| GET | /api/dashboard/overview | fechaDesde, fechaHasta, subDireccion, departamento, clasificacion, estado, responsable | 200 | 500 |

Response shape:
- kpis
- charts (14 datasets)
- filterOptions

## Common Error Pattern
Most controllers return:
- { error: 'mensaje' } with status 400/404/409/500 depending on case.

## Auth And Security State
- No JWT/OAuth middleware currently active.
- CORS enabled globally.

## Cross References
- Backend logic: BACKEND.md
- Data model dependencies: DATABASE.md
- Frontend service consumers: FRONTEND.md
