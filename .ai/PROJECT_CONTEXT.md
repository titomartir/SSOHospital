# Project Context

## General Description
SSOHospital is a full stack risk management system for occupational safety workflows.
It includes:
- Organizational catalogs (sub-direcciones, departamentos, servicios, puestos, funciones).
- Risk and hazard catalogs.
- Risk matrix evaluations with multi-function and multi-risk detail structure.
- Preventive planning records.
- Executive dashboard with KPIs and chart datasets.

See also:
- ARCHITECTURE.md
- DATABASE.md
- API.md
- FRONTEND.md
- BACKEND.md

## System Objective
Provide a centralized platform to register, evaluate, monitor, and report workplace risks in hospital operations.

## Scope
In scope:
- CRUD APIs for catalogs and matrix entities.
- Dashboard analytical endpoint with filters.
- Frontend SPA for dashboard, matrix, and catalogs.
- PostgreSQL persistence with migration scripts.

Out of current scope:
- Real authentication/authorization backend.
- Automated tests suite (unit/integration/e2e).
- CI/CD pipeline automation.

## Current Status
- Frontend and backend are integrated through /api proxy in Vite.
- DB schema evolved from matriz_riesgos monolith into hierarchical model:
  - matriz_evaluaciones
  - matriz_evaluacion_funciones
  - matriz_evaluacion_detalles
- Dashboard endpoint active: GET /api/dashboard/overview.
- Planificacion route still exists in backend, but frontend navigation redirects /planificacion to /matriz.

## Existing Modules
- Frontend modules:
  - Dashboard
  - Matriz de Riesgos
  - Catalogos
- Backend modules:
  - Catalogos organizacionales
  - Catalogos de riesgo/peligro
  - Matriz
  - Planificacion
  - Dashboard overview

## Pending / Improvement Modules
- Real auth flow and role-based access control.
- Automated testing strategy.
- CI/CD pipeline.
- Observability (structured logs, metrics).
- Documentation cleanup of legacy/outdated docs.

## Main Dependencies
Frontend:
- React 19
- Vite 8
- TailwindCSS 4
- Axios
- Recharts
- react-router-dom

Backend:
- Express 5
- pg
- dotenv
- cors

Infra:
- Docker Compose
- PostgreSQL 15
- pgAdmin 4

## System Flow (High Level)
1. User interacts with SPA pages.
2. DataContext triggers service calls via Axios (base /api).
3. Express routes dispatch to controllers.
4. Controllers validate required fields and call models.
5. Models execute SQL on PostgreSQL and shape response payloads.
6. Frontend updates local state and UI.

## Inconsistencies Found (Documented before any logic change)
1. backend-SSSO/src/POSTGRESQL_PGADMIN.md is outdated and references another domain and ports/db names not matching current docker-compose.yml.
2. SSO/README.md is generic Vite template and does not describe this project.
3. backend-SSSO/package.json has db:migrate-puestos-servicio pointing to migrate_puestos_funciones_relacion.sql (name mismatch vs intent).
4. Frontend still includes useLocalStorage hook and dependencies html2canvas/jspdf/xlsx while some flows changed over time; active usage is partial.

## Executive Summary
The project is operational with a clear React + Express + PostgreSQL architecture and a mature risk matrix evolution.
Main technical debt is concentrated in documentation consistency, absence of tests/CI, and missing production-grade security/auth controls.
