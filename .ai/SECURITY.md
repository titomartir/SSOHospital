# Security

## Current Security State
This project currently focuses on functional delivery and has limited built-in security controls.

## Authentication
- Frontend AuthContext is simulated and local-state based.
- Backend does not enforce authentication for /api endpoints.
- No session or token verification middleware currently active.

## Authorization
- No role-based authorization checks in backend controllers.
- UI role label exists in AuthContext but is not security-enforced.

## JWT / OAuth
- Not implemented in backend.
- No JWT secret, token lifecycle, refresh strategy, or OAuth provider integration.

## Input Validation
- Controller-level required-field checks exist for many endpoints.
- Matrix model has deeper payload validation.
- No centralized schema validator (e.g., zod/joi/ajv) currently in use.

## SQL Injection Protection
- Model queries use parameterized SQL ($1, $2, ...), which mitigates injection risk in query values.
- Continue forbidding dynamic SQL concatenation with user input.

## CSRF
- No CSRF strategy is required for pure token-less API currently, but if cookie-based auth is introduced later, CSRF protection must be added.

## XSS
- React default escaping provides baseline protection in rendered content.
- Risk remains where raw HTML printing/export flows are used; keep strict control over inserted content.

## CORS
- cors() enabled globally with default behavior.
- No strict origin allowlist configured yet.

## Secrets Management
- Credentials are environment-driven via .env pattern.
- Secrets are not managed by vault/KMS pipeline.
- Avoid committing real credentials in production scenarios.

## Logging And Monitoring
- Error logging uses console.*.
- No audit logging, SIEM integration, or alerting configured.

## Security Gaps (Priority)
1. Missing real authentication in backend.
2. Missing authorization middleware and role policies.
3. Missing rate limiting and brute-force protections.
4. Missing central validation and request sanitization strategy.
5. Missing production CORS hardening and secrets lifecycle process.

## Hardening Proposal Process Rule
If an architecture-impacting security change is identified, first document in DECISIONS.md and wait for explicit approval before implementation.

## Cross References
- Architecture boundaries: ARCHITECTURE.md
- API exposure surface: API.md
- Environment/runtime controls: DEVOPS.md
