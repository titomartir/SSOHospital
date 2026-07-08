# PostgreSQL y pgAdmin - SSOHospital

Esta guia describe la configuracion real del proyecto actual.

## Servicios y puertos

### Modo Docker completo (recomendado)

- PostgreSQL (contenedor `sso_dev_db`): `localhost:5435`
- pgAdmin (contenedor `sso_dev_pgadmin`): `http://localhost:5053`
- API backend (contenedor `sso_dev_backend`): `http://localhost:3100`
- Frontend (contenedor `sso_dev_frontend`): `http://localhost:5178`

### Modo Docker legado (solo DB + pgAdmin en backend-SSSO/docker-compose.yml)

- PostgreSQL (contenedor `sso_postgres_db`): `localhost:5433`
- pgAdmin (contenedor `sso_pgadmin`): `http://localhost:5050`

## Credenciales locales de desarrollo

Fuente: `backend-SSSO/docker-compose.yml` y `backend-SSSO/.env.example`.

- PostgreSQL
  - Usuario: `appuser`
  - Password: `SSOHospital2024`
  - Base de datos: `SSO`

- pgAdmin
  - Email: `admin@admin.com`
  - Password: `admin123`

## Levantar stack dockerizado completo

Desde la raiz del repositorio:

```powershell
docker compose -f docker-compose.dev.yml up -d
```

Detener stack:

```powershell
docker compose -f docker-compose.dev.yml down
```

## Levantar solo infraestructura de datos (modo legado)

Desde `backend-SSSO`:

```powershell
npm run docker:up
```

Verificar conexion backend -> DB:

```powershell
npm run db:test
```

## Conectar pgAdmin al contenedor

1. Abrir `http://localhost:5050`.
2. Register -> Server.
3. General:
   - Name: `SSOHospital Local`
4. Connection:
  - Host name/address: `db`
  - Port: `5432`
  - Maintenance database: `SSO`
  - Username: `appuser`
  - Password: `SSOHospital2024`
5. Save.

Nota: dentro de Docker se usa `db:5432`; desde tu host se usa `localhost:5433`.

## Comandos utiles

Desde `backend-SSSO`:

```powershell
# Levantar contenedores
npm run docker:up

# Detener contenedores
npm run docker:down

# Verificar conexion a PostgreSQL
npm run db:test

# Inicializar esquema base (si aplica)
npm run db:init
```

Consola SQL directa al contenedor:

```powershell
docker compose exec db psql -U appuser -d SSO
```

## Migraciones disponibles

Scripts npm en `backend-SSSO/package.json`:

- `db:migrate-estructura`
- `db:migrate-puestos-funciones`
- `db:migrate-riesgo-peligro`
- `db:migrate-matriz`
- `db:migrate-matriz-bloques`
- `db:migrate-matriz-maestro-detalle`
- `db:migrate-matriz-funciones`
- scripts de rollback relacionados

En `docker-compose.dev.yml`, las migraciones principales tambien se ejecutan automaticamente al inicializar un volumen nuevo de PostgreSQL, montadas como archivos `.sql` ordenados dentro de `/docker-entrypoint-initdb.d`.

## Estado de verificacion actual

La configuracion Docker del proyecto ya fue validada a nivel de compose.
Si aparece el error `commit failed: structure needs cleaning`, el problema esta en el daemon Docker del host y no en esta configuracion del proyecto.

## Solucion de problemas

- Si `db:test` falla por conexion:
  - confirma que `docker:up` este activo.
  - confirma puerto `5433` libre en host.
  - valida credenciales en `.env`.

- Si pgAdmin no conecta:
  - usa `db` como host desde pgAdmin (no `localhost`).
  - confirma que el contenedor `sso_pgadmin` este en estado `Running`.

## Seguridad

Las credenciales de este documento son solo para desarrollo local.
No reutilizar en ambientes productivos.
