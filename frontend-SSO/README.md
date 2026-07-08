# SSO Frontend

Frontend SPA del sistema SSOHospital.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- React Router
- Axios
- Recharts

## Requisitos

- Node.js 18+
- Backend activo en `http://localhost:3000`

## Instalacion

Desde esta carpeta (`frontend-SSO`):

```powershell
npm install
```

## Ejecucion en desarrollo

```powershell
npm run dev
```

Por defecto usa puerto `5173`.
Si el puerto esta ocupado, Vite usara el siguiente disponible.

## Ejecucion con Docker (stack completo)

Desde la raiz del repositorio:

```powershell
docker compose -f docker-compose.dev.yml up -d
```

Accesos en modo Docker:

- Frontend: `http://localhost:5178`
- Backend API: `http://localhost:3100/api/health`

## Build de produccion

```powershell
npm run build
```

Previsualizar build:

```powershell
npm run preview
```

## Integracion con backend

El proxy de Vite esta configurado para redirigir `/api` hacia:

- `http://localhost:3000`

En Docker, el proxy se ajusta por variable de entorno (`VITE_PROXY_TARGET`) y apunta al servicio `backend`.

Archivo de referencia:

- `vite.config.js`

## Estructura principal

```text
src/
	components/
	context/
	hooks/
	pages/
	services/
	utils/
```

## Paginas actuales

- Dashboard (`/`)
- Matriz de Riesgos (`/matriz`)
- Catalogos (`/catalogos`)

Nota: la ruta `/planificacion` redirige a `/matriz`.

## Exportaciones

- Dashboard: exportacion PDF (flujo de impresion) y CSV.
- Matriz: impresion de evaluaciones.

## Solucion de problemas rapida

- Si frontend no conecta a la API:
	- verifica backend en `http://localhost:3000/api/health`.
	- confirma que el proxy siga apuntando a `localhost:3000`.

- Si cambia de puerto (5174, 5175, etc.):
	- hay otro proceso ocupando `5173`.
	- cierra procesos previos de Vite y vuelve a iniciar.
