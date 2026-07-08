#!/bin/sh
set -e

echo "[initdb] Running SSO migration bootstrap..."

run_sql() {
  file="$1"
  echo "[initdb] Applying ${file}"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$file"
}

run_sql /docker-entrypoint-initdb.d/migrations/migrate_estructura_organizacional.sql
run_sql /docker-entrypoint-initdb.d/migrations/migrate_puestos_funciones_relacion.sql
run_sql /docker-entrypoint-initdb.d/migrations/migrate_riesgo_peligro_relacion.sql
run_sql /docker-entrypoint-initdb.d/migrations/migrate_matriz_jerarquica.sql
run_sql /docker-entrypoint-initdb.d/migrations/migrate_matriz_riesgo_bloques.sql
run_sql /docker-entrypoint-initdb.d/migrations/migrate_matriz_maestro_detalle.sql
run_sql /docker-entrypoint-initdb.d/migrations/migrate_matriz_funciones_jerarquia.sql

echo "[initdb] Migration bootstrap completed."
