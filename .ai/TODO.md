# TODO

## Pending Tasks
- [ ] Validar manualmente Fase 4A en UI de Catálogos (alta/edición/eliminación de Medidas Preventivas, Acciones, Recursos y Responsables).
- [x] Align backend-SSSO/src/POSTGRESQL_PGADMIN.md with actual project runtime.
- [x] Create repository-level README with real startup and architecture notes.
- [ ] Define official migration execution order in one runbook.
- [ ] Reintentar validacion de arranque Docker completo tras estabilizar daemon del host.
- [ ] Si persiste `structure needs cleaning`, reparar o reinstalar Docker Desktop antes de revalidar este proyecto.
- [ ] Ejecutar carga piloto de datos maestros para Riesgos Físicos antes de implementar relaciones conceptuales avanzadas entre catálogos.
- [ ] Evaluar FASE 5E solo después de completar y proteger la base maestra de catálogo piloto.

## Active / Implemented
- [x] FASE 5A completada y aprobada: auditoría del contrato real matriz confirmada.
- [x] FASE 5B implementada: backend matriz acepta legacy text + nuevas FK, con dual-write temporal y GET con IDs/nombres.
- [x] FASE 5C completa, recuperada y validada: flujo FK, selects, validación y persistencia en actualización confirmados.
- [x] FASE 5D completa y validada funcionalmente: prioridad `nombre normalizado > texto legacy > '-'` aplicada en detalle e impresión.
- [x] Compatibilidad legacy confirmada para registros con FK NULL.
- [x] FASE 5E no iniciada.
- [x] Columnas TEXT legacy conservadas temporalmente y registros actuales protegidos.

## Known Issues / Risks
- [ ] Authentication is simulated on frontend and absent on backend enforcement.
- [ ] No automated tests to guard regressions.
- [ ] Potential port drift in Vite when old processes remain active.
- [ ] Mixed historical schema context (matriz_riesgos vs matriz_evaluaciones hierarchy) can confuse onboarding.

## Refactoring Opportunities (Require approval if architecture-impacting)
- [ ] Introduce centralized request validation layer.
- [ ] Introduce centralized error middleware.
- [ ] Formalize service/repository abstractions if needed for scaling.

## Improvement Ideas
- [ ] Add API contract generation (OpenAPI).
- [ ] Add smoke tests for critical endpoints.
- [ ] Add CI workflow for lint/build checks.
- [ ] Add role model and protected routes.
