# Configuración de PostgreSQL y pgAdmin

## ✅ Cambios Realizados

La aplicación ahora usa **PostgreSQL 15** en lugar de MySQL 8.0.

### Servicios Disponibles:

1. **PostgreSQL**: Puerto `5432`
2. **pgAdmin 4**: Puerto `5050` (http://localhost:5050)
3. **API Server**: Puerto `4000`
4. **Client (React)**: Puerto `5174`

## 🔌 Conectar a pgAdmin

### 1. Acceder a pgAdmin
Abre tu navegador en: **http://localhost:5050**

**Credenciales de pgAdmin:**
- Email: `admin@admin.com`
- Password: `admin123`

### 2. Agregar Servidor en pgAdmin

Una vez dentro de pgAdmin:

1. Click derecho en "Servers" → "Register" → "Server"

2. En la pestaña **General**:
   - Name: `Banco de Sangre Local`

3. En la pestaña **Connection**:
   - Host name/address: `db` (nombre del contenedor Docker)
   - Port: `5432`
   - Maintenance database: `banco_sangre`
   - Username: `appuser`
   - Password: `CAMBIAR_POR_PASSWORD_SEGURA_123!@#` (valor del .env)
   - ✅ Save password (opcional)

4. Click en "Save"

### 3. Explorar la Base de Datos

Después de conectar, podrás ver:

```
Banco de Sangre Local
└── Databases
    └── banco_sangre
        └── Schemas
            └── public
                └── Tables
                    ├── donante (29,311 registros históricos)
                    ├── entrevistas
                    └── serologias
```

## 🔧 Conexión Directa (opcional)

Si deseas conectarte con otra herramienta:

**Conexión desde localhost:**
- Host: `localhost`
- Port: `5432`
- Database: `banco_sangre`
- Username: `appuser`
- Password: `CAMBIAR_POR_PASSWORD_SEGURA_123!@#` (valor del .env)

**Conexión desde código Node.js:**
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'appuser',
  password: 'CAMBIAR_POR_PASSWORD_SEGURA_123!@#',
  database: 'banco_sangre'
});
```

## 📊 Importar Datos Históricos a PostgreSQL

Los datos de MySQL deben ser migrados a PostgreSQL. Para importar los 29,311 donantes:

### Opción 1: Usar el script de conversión actualizado

```powershell
# 1. Generar archivo SQL compatible con PostgreSQL
python convertir_donantes_postgresql.py

# 2. Importar a la base de datos
Get-Content -Raw donantes_migrados_postgresql.sql | docker compose exec -T db psql -U appuser -d banco_sangre
```

### Opción 2: Usar pgAdmin

1. En pgAdmin, click derecho en la tabla `donante`
2. Seleccionar "Import/Export Data..."
3. Import → CSV file
4. Seleccionar el archivo y mapear las columnas

## 🔄 Comandos Útiles

### Reiniciar servicios
```powershell
docker compose restart
```

### Ver logs de PostgreSQL
```powershell
docker compose logs db
```

### Acceder a psql (consola PostgreSQL)
```powershell
docker compose exec db psql -U appuser -d banco_sangre
```

### Ejemplos de queries en psql
```sql
-- Ver todas las tablas
\dt

-- Contar donantes
SELECT COUNT(*) FROM donante;

-- Ver estructura de tabla
\d donante

-- Buscar donantes
SELECT "idDonante", "Nombre", "Apellido", "Grupo" 
FROM donante 
LIMIT 10;

-- Salir de psql
\q
```

## ⚠️ Diferencias Importantes MySQL → PostgreSQL

1. **Comillas**: PostgreSQL usa comillas dobles para nombres de columnas con espacios o mayúsculas
   - Antes: `` `Fecha de Nacimiento` ``
   - Ahora: `"Fecha de Nacimiento"`

2. **Parámetros**: PostgreSQL usa `$1, $2, $3` en lugar de `?`
   - Antes: `SELECT * FROM donante WHERE id = ?`
   - Ahora: `SELECT * FROM donante WHERE "idDonante" = $1`

3. **AUTO_INCREMENT**: PostgreSQL usa `SERIAL`
   - Antes: `id INT AUTO_INCREMENT`
   - Ahora: `id SERIAL`

4. **LIMIT**: Sintaxis similar pero más flexible en PostgreSQL
   - `LIMIT 10 OFFSET 20`

5. **ILIKE**: PostgreSQL tiene búsqueda case-insensitive nativa
   - Antes: `WHERE nombre LIKE '%juan%'`
   - Ahora: `WHERE "Nombre" ILIKE '%juan%'`

## 🎯 URLs de Acceso

- **Aplicación React**: http://localhost:5174
- **API Backend**: http://localhost:4000/api
- **pgAdmin**: http://localhost:5050
- **PostgreSQL**: localhost:5432

## 📁 Archivos Modificados

- [docker-compose.yml](docker-compose.yml) - Cambiado de MySQL a PostgreSQL, agregado pgAdmin
- [server/package.json](server/package.json) - Cambiado `mysql2` por `pg`
- [server/src/models/db.js](server/src/models/db.js) - Adaptado para PostgreSQL
- [server/src/sql/create_tables.sql](server/src/sql/create_tables.sql) - Sintaxis PostgreSQL
- [server/src/controllers/*.js](server/src/controllers/) - Actualizado queries para PostgreSQL

## 🔒 Seguridad

**Importante:** Las contraseñas en este archivo son para desarrollo local. 
En producción, usa variables de entorno seguras y contraseñas fuertes.
