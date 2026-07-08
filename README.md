# SSOHospital

Repositorio full stack para gestion de matriz de riesgos hospitalarios.

## Stack

- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express
- Base de datos: PostgreSQL 15
- Administracion DB: pgAdmin

## Arranque rapido (Docker completo de desarrollo)

Desde la raiz:

```powershell
docker compose -f docker-compose.dev.yml up -d
```

Accesos:

- Frontend: http://localhost:5178
- Backend: http://localhost:3100
- Health API: http://localhost:3100/api/health
- PostgreSQL: localhost:5435
- pgAdmin: http://localhost:5053

Detener:

```powershell
docker compose -f docker-compose.dev.yml down
```

## Puertos usados por este stack Docker

- Frontend: 5178
- Backend: 3100
- PostgreSQL: 5435
- pgAdmin: 5053

## Notas

- El frontend usa hot reload dentro del contenedor.
- El backend usa nodemon con hot reload.
- En primera inicializacion de PostgreSQL se ejecutan:
  - init.sql
  - migraciones SQL montadas en orden dentro de docker-entrypoint-initdb.d

## Si Docker falla al crear contenedores

Si Docker devuelve `commit failed: structure needs cleaning`, el problema es del daemon/engine local.
La configuracion del proyecto ya fue validada con `docker compose -f docker-compose.dev.yml config`.

## Desarrollo sin Docker

### Backend

```powershell
cd backend-SSSO
npm install
npm run docker:up
npm run db:test
npm start
```

### Frontend

```powershell
cd frontend-SSO
npm install
npm run dev
```

## Documentacion tecnica

- Reglas del agente: .github/copilot-instructions.md
- Contexto y continuidad: .ai/
