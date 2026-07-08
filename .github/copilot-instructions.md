# Copilot Permanent Instructions - SSOHospital

## Purpose
This file defines permanent rules for AI-assisted development in this repository.
It should change rarely.

## Mandatory Startup Flow For Every Task
1. Read .github/copilot-instructions.md.
2. Read all files under .ai/.
3. Recover technical context before proposing or applying changes.
4. Evaluate impact first (frontend, backend, db, api, docs, devops, security).

## Project Conventions
- Frontend: React + Vite + Tailwind v4 + Recharts.
- Backend: Node.js + Express (ES modules) + pg.
- Database: PostgreSQL 15 (Docker Compose in backend-SSSO).
- API base path: /api.
- Language in code: existing Spanish domain naming is accepted and should be preserved.
- Keep existing folder structure and module boundaries.

## Coding Style
- Keep functions small and focused.
- Prefer explicit naming over short abbreviations.
- Do not duplicate business rules between frontend and backend unless required for UX validation.
- Preserve response shapes already consumed by frontend services.
- Keep SQL parameterized ($1, $2, ...). Never build SQL with string concatenation using user input.

## Architecture Guardrails
- Maintain layered backend flow: route -> controller -> model -> db.
- Keep frontend data orchestration inside DataContext and service layer.
- Avoid moving logic across layers unless explicitly requested.
- Keep backward compatibility for existing payload formats when already supported.

## SOLID / DRY / Clean Code
- Single Responsibility: one module, one main reason to change.
- Open/Closed: prefer extension over rewriting stable modules.
- Liskov: do not change function contracts unexpectedly.
- Interface Segregation: expose only required methods in context/services.
- Dependency Inversion: consume abstractions (service/context) from UI when possible.
- DRY: centralize repeated transform/validation logic.

## Reusability And Modularity
- Reuse existing UI primitives in SSO/src/components.
- Reuse existing hooks in SSO/src/hooks when applicable.
- Reuse existing SQL migration pattern in backend-SSSO/src/db.

## Safety Restrictions
- Do not change database schema, architecture, or behavior-critical flows without explicit approval.
- If an architectural improvement is detected, document proposal first in .ai/DECISIONS.md and wait for approval.
- Do not remove files unless explicitly requested.
- Do not silently alter endpoint contracts.

## Documentation Rules
- Keep .ai docs synchronized with code changes.
- Update only impacted documents:
  - DB changes -> .ai/DATABASE.md
  - API changes -> .ai/API.md
  - Frontend changes -> .ai/FRONTEND.md
  - Backend changes -> .ai/BACKEND.md
  - Infra changes -> .ai/DEVOPS.md
  - Architecture changes -> .ai/ARCHITECTURE.md
- Always update:
  - .ai/CHANGELOG_AI.md
  - .ai/SESSION_SUMMARY.md
- Update .ai/ROADMAP.md and .ai/TODO.md when scope/priorities move.
- Register important tradeoffs in .ai/DECISIONS.md.

## Validation Checklist Before Finishing
1. Build or lint impacted areas when possible.
2. Confirm no unintended contract changes.
3. Document what changed and why.
4. Record pending work and blockers in SESSION_SUMMARY.
