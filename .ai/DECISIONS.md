# Technical Decisions Log

## 2026-07-08 - AI Documentation Baseline
- Problem:
  - Project context was spread across code and prior chat history, increasing onboarding cost for each session.
- Decision:
  - Create a permanent technical memory layer in .ai plus stable agent rules in .github/copilot-instructions.md.
- Justification:
  - Improves continuity, reduces ambiguity, and standardizes update flow.
- Alternatives considered:
  - Keep context only in chat history.
  - Use only a single README.
- Impact:
  - Better maintainability for future AI-assisted iterations.
  - No behavior changes in application runtime.

## 2026-07-08 - Architecture Change Approval Gate
- Problem:
  - Unapproved architecture changes can break stability in active modules.
- Decision:
  - If architectural, database, or behavior-impacting improvement is detected, document proposal first and wait for user approval.
- Justification:
  - Protects production behavior and aligns with controlled delivery.
- Alternatives considered:
  - Auto-implement improvements when technically beneficial.
- Impact:
  - Slower but safer major changes; higher traceability.

## Open Proposals (No implementation without approval)
- Proposal:
  - Remove or rewrite outdated document backend-SSSO/src/POSTGRESQL_PGADMIN.md to match actual ports/db names.
- Expected impact:
  - Reduces onboarding confusion.
- Status:
  - Approved and implemented on 2026-07-08.

## 2026-07-08 - Docker Dev Ports And Full Stack Compose
- Problem:
  - Existing local ports conflicted with other projects and only DB/pgAdmin were dockerized.
- Decision:
  - Create full development compose stack at repo root with non-conflicting host ports:
    - Frontend 5178
    - Backend 3100
    - PostgreSQL 5435
    - pgAdmin 5053
- Justification:
  - Enables full dockerized development and respects host port constraints.
- Alternatives considered:
  - Keep legacy compose only for db/pgadmin and run frontend/backend outside containers.
  - Use Docker build-based app images (discarded in this host due daemon filesystem issue during image commit).
- Impact:
  - Infrastructure improvement without changing business logic.
  - Hot reload enabled via bind mounts in containers.
