# Roadmap

## Implemented
- React SPA with dashboard, matrix, and catalog management.
- Express modular API with catalog CRUD, matrix CRUD, planning CRUD, and dashboard overview.
- PostgreSQL local runtime with Docker Compose and migration scripts.
- Matrix hierarchy evolution to evaluacion -> funciones -> detalles.
- Dashboard endpoint with filters and multi-dataset analytics.
- FASE 5A completed and approved: real matrix contract audited and legacy compatibility confirmed.
- FASE 5B implemented: backend matrix supports legacy text + new FK fields with transient dual-write and LEFT JOIN GET contract.
- FASE 5C completed, recovered and validated: MatrizPage FK-first flow and update semantics preserved and confirmed.
- FASE 5D completed and functionally validated: normalized read/display priority is catalog name > legacy text > '-'.
- Legacy compatibility confirmed: FK NULL records still render legacy text fields.
- FASE 5E not started.

## In Progress / Active Stabilization
- Documentation normalization and technical continuity baseline.
- Export/reporting quality hardening in dashboard workflows.
- Relational design definition for the next evolution after pilot data load of master data for riesgos físicos.

## Future Priorities
1. Real authentication and authorization in backend.
2. Automated testing (frontend + backend + integration).
3. CI/CD workflows and environment promotion strategy.
4. Structured validation and centralized error handling.
5. Observability (logs, metrics, tracing).
6. Legacy documentation cleanup.

## Priority Levels
- P1:
  - Auth + authorization.
  - Test baseline.
- P2:
  - CI/CD.
  - Validation/error middleware.
- P3:
  - Observability and non-functional hardening.
  - Docs cleanup and developer onboarding automation.
