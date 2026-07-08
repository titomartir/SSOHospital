# DevOps

## Runtime Topology (Local)
- Frontend (Vite local): localhost:5173 (or next available port if occupied).
- Backend (Express local): localhost:3000.
- Legacy DB compose (backend-SSSO/docker-compose.yml):
  - PostgreSQL: localhost:5433 -> container 5432.
  - pgAdmin: localhost:5050.
- Full Docker dev stack (docker-compose.dev.yml at repo root):
  - Frontend: localhost:5178 -> container 5173.
  - Backend: localhost:3100 -> container 3000.
  - PostgreSQL: localhost:5435 -> container 5432.
  - pgAdmin: localhost:5053 -> container 80.

## Docker Compose
File: backend-SSSO/docker-compose.yml
Services:
- db:
  - image postgres:15-alpine
  - container sso_postgres_db
  - env POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
  - port mapping 5433:5432
  - volume postgres_data
  - mounts init.sql as docker-entrypoint-initdb.d/init.sql
- pgadmin:
  - image dpage/pgadmin4
  - container sso_pgadmin
  - depends_on db
  - port mapping 5050:80

File: docker-compose.dev.yml (repo root)
Services:
- db (postgres:15-alpine)
  - healthcheck enabled
  - mounts init.sql + migration SQL files in ordered startup sequence
- backend (node:20-alpine)
  - hot reload with nodemon (`npm run dev -- -L`)
  - bind mount backend source + named volume node_modules
- frontend (node:20-alpine)
  - hot reload with Vite
  - bind mount frontend source + named volume node_modules
  - proxy target configurable via VITE_PROXY_TARGET
- pgadmin (dpage/pgadmin4)

Named volumes:
- sso_dev_postgres_data
- sso_dev_backend_node_modules
- sso_dev_frontend_node_modules
- sso_dev_pgadmin_data

Network:
- sso_dev_net (bridge)

## Environment Variables
Source template: backend-SSSO/.env.example
- PORT
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT
- DB_NAME

## Build And Run Commands
### Backend
- Install: npm install
- Start prod-like: npm start
- Start dev: npm run dev
- Docker up: npm run docker:up
- Docker down: npm run docker:down
- DB test: npm run db:test

### Frontend
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview

### Full Docker Dev Stack
- Start: docker compose -f docker-compose.dev.yml up -d
- Stop: docker compose -f docker-compose.dev.yml down
- Validate compose: docker compose -f docker-compose.dev.yml config

## Migration Commands (Backend)
- npm run db:init
- npm run db:migrate-estructura
- npm run db:migrate-puestos-funciones
- npm run db:migrate-riesgo-peligro
- npm run db:migrate-matriz
- npm run db:migrate-matriz-bloques
- npm run db:migrate-matriz-maestro-detalle
- npm run db:migrate-matriz-funciones
- rollback variants available in package scripts.

## CI/CD
- No .github/workflows detected.
- No pipeline automation currently documented in repo.

## Infra Notes
- Frontend proxy is configured in frontend-SSO/vite.config.js to route /api to backend.
- Ports can shift for Vite when occupied unless strictPort is used at runtime.
- In Docker stack, proxy target is set by env var `VITE_PROXY_TARGET`.
- PostgreSQL startup applies ordered SQL files mounted into `/docker-entrypoint-initdb.d`.

## Operational Risks
- Missing centralized runbook with enforced migration order.
- No environment separation strategy beyond local dev conventions.
- Docker daemon instability on host can block container creation (`structure needs cleaning`), independent of compose syntax.

## Verification Status
- `docker compose -f docker-compose.dev.yml config`: OK.
- `docker compose -f docker-compose.dev.yml up -d db`: blocked by Docker daemon error.
- `docker run postgres:15-alpine` minimal isolated test: same daemon error.
- Conclusion: current blocker is host Docker engine state, not project Docker configuration.

## Recommended Operational Baseline
1. Start db containers.
2. Run db:test.
3. Start backend.
4. Start frontend.
5. Validate /api/health and key pages.

## Cross References
- Data model evolution: DATABASE.md
- API contracts: API.md
- Security controls and gaps: SECURITY.md
