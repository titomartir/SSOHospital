import { createRequire } from 'module'
import { config } from 'dotenv'
import pkg from 'pg'

// Carga las variables de entorno directamente (sin dotenvx)
config()

const { Pool } = pkg

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  client_encoding: 'UTF8',
})

pool.on('error', (err) => {
  console.error('⚠️  Error inesperado en el pool de PostgreSQL:', err.message)
})

export default pool