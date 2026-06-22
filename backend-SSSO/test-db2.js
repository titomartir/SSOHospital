import { configDotenv } from 'dotenv'
configDotenv()

import pkg from 'pg'
const { Pool } = pkg

console.log('Connecting with:', {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
})

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const r = await pool.query('SELECT NOW() as now')
console.log('✅ Conexión OK:', r.rows[0])
await pool.end()
