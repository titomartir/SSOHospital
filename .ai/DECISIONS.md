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

## 2026-09-18 - FASE 5C/5D Closure And Functional Validation
- Problem:
  - The matrix needed a reliable closure for the recovered FK-first form flow and a read-side normalization strategy without broadening scope into application or database changes.
- Decision:
  - Close FASE 5C as complete, recovered and validated.
  - Close FASE 5D as complete and functionally validated.
  - Keep the current design grounded in the validated behavior:
    - legacy compatibility for records with FK NULL remains active.
    - normalized names are preferred in reads and print/export detail.
    - text legacy columns remain temporarily preserved.
  - FASE 5E remains not started.
- Justification:
  - Ensures the codebase and data model remain stable while the FK-first flow is proven and the display behavior is documented.
- Alternatives considered:
  - Rewriting the create/edit flow again.
  - Removing legacy columns or deprecating them prematurely.
- Impact:
  - No application code or database schema changes were made during this closure.

## 2026-09-18 - Relational Design Decision For Next Evolution
- Problem:
  - The next step needs a conceptual relationship model for catalogs without yet implementing any relationship layer.
- Decision:
  - Define the conceptual flow as:
    - Peligro -> Medida Preventiva -> Acción -> Recursos / Responsables
    - Responsable remains conceptually related to Acción, not to Recurso.
  - The four catalogs remain independent at the current stage.
  - Relationships are not implemented yet.
  - A pilot master-data load for Riesgos Físicos will be performed before relation implementation.
  - Existing catalog records remain protected.
- Justification:
  - Preserves current independence while modeling the next layer of data governance and ownership without forcing premature schema coupling.
- Alternatives considered:
  - Implementing relations immediately without pilot master-data validation.
  - Treating Responsable as associated with Recurso by default.
- Impact:
  - This is a design-only decision; no relational implementation or data migration was executed.

## 2026-09-17 - Phase 2B Independent Catalogs Migration Prepared
- Problem:
  - The project required DB schema preparation for four new independent catalogs (medidas_preventivas, acciones, recursos, responsables) while preserving current system behavior and existing catalogs.
- Decision:
  - Create migration + rollback SQL files only, without executing them.
  - Keep current text columns in matriz_evaluacion_detalles unchanged in this phase:
    - medidas_prev
    - acciones
    - recursos
    - responsable
  - Add nullable FK columns for transition:
    - medida_preventiva_id
    - accion_id
    - recurso_id
    - responsable_id
  - Use ON UPDATE CASCADE and ON DELETE RESTRICT for new FK constraints.
  - Integrate migration into fresh-install bootstrap order only.
- Justification:
  - Enables controlled transition with rollback path and no destructive impact on existing operational catalogs.
- Alternatives considered:
  - Immediate execution in active DB (rejected: phase scope requires preparation only).
  - Removing text columns in same phase (rejected: transition safety requirement).
- Data protection constraints:
  - Existing catalogs must remain intact:
    - sub_direcciones, departamentos, servicios, puestos, funciones, riesgos, peligros.
  - No DELETE/TRUNCATE strategy used in migration.
- Backup reference:
  - E:/Backup_SSOHospital/Pre_Migraciones/SSO_pre_catalogos_2026-09-17_13-35-03.dump
  - SHA256: 146099406E0EDCF436F181C38E12C5CD740D45890A610217D5AFF7B25BBDB660
