# Frontend

## Stack
- React 19
- Vite 8
- TailwindCSS 4
- react-router-dom 7
- Axios
- Recharts
- react-hot-toast

## Entry And App Shell
- Entry: SSO/src/main.jsx
- Router: BrowserRouter
- Global providers:
  - AuthProvider
  - DataProvider
- Main shell in SSO/src/App.jsx:
  - Sidebar + Navbar + page routes.

## Routes
- / -> Dashboard
- /matriz -> MatrizPage
- /catalogos -> CatalogosPage
- /planificacion -> redirected to /matriz
- * -> redirected to /

## Global State
### AuthContext
- Current state is simulated local user data (no backend auth).
- Exposes user, isAuthenticated, login, logout.

### DataContext
- Bootstraps data from:
  - matrizService.getAll
  - planificacionService.getAll
  - catalogoService.getAll
- Stores:
  - matriz
  - planificaciones
  - catalogos
  - stats (derived)
- Exposes CRUD and refresh methods for all catalog and matrix entities.

## Services Layer
- api.js: Axios instance with baseURL /api and timeout 5000ms.
- catalogoService.js: catalog and tree CRUD calls.
- matrizService.js: matrix CRUD.
- planificacionService.js: planning CRUD.
- dashboardService.js: dashboard overview with query filters.

## Pages
### Dashboard.jsx
- KPI cards and chart panels.
- Uses Recharts for bar/line/pie/donut datasets.
- Supports filter-driven querying.
- Export actions:
  - CSV export.
  - PDF via print workflow.

### MatrizPage.jsx
- Multi-function evaluation capture.
- Per-function risk blocks.
- Validation integration with validateMatrizForm.
- Detail view and print/export support.

### CatalogosPage.jsx
- Full hierarchical catalog management.
- Handles selection/editing/deletion for organizational and risk catalogs.

## Reusable Components
- UI primitives: Button, InputField, SelectField, Modal, Badge, Card, DataTable, Loader.
- Dashboard components: KpiStatCard, ChartPanel, HeatmapGrid.
- Layout components: Sidebar, Navbar.

## Hooks
- useForm: managed form state + validation trigger.
- useFilters: generic filtering abstraction.
- usePagination: page/pageSize slicing.
- useLocalStorage: utility hook (currently not central to main data flow).

## Frontend Validation And Utils
- validators.js:
  - required field checks.
  - nested matrix function/risk checks.
  - duplicate riesgo-peligro pair prevention per function.
  - max length controls for long text fields.
- calculators.js:
  - risk level and classification.
- formatters.js:
  - date and number formatting.

## Navigation And State Notes
- Loading behavior at app level is controlled by DataContext.loading.
- Toast notifications are used for create/update/delete feedback.
- Backend contract differences are normalized in service/context logic where needed.

## Known Frontend Risks
- AuthContext is mock-only and not security-grade.
- Some dependencies may be partially used depending on feature state.
- Generic README is not aligned with this project behavior.

## Cross References
- API contracts: API.md
- Backend providers: BACKEND.md
- Architectural flow: ARCHITECTURE.md
