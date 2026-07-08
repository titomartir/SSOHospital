# TODO

## Pending Tasks
- [x] Align backend-SSSO/src/POSTGRESQL_PGADMIN.md with actual project runtime.
- [x] Create repository-level README with real startup and architecture notes.
- [ ] Define official migration execution order in one runbook.
- [ ] Reintentar validacion de arranque Docker completo tras estabilizar daemon del host.
- [ ] Si persiste `structure needs cleaning`, reparar o reinstalar Docker Desktop antes de revalidar este proyecto.

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
