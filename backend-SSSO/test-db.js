import pool from './src/db/connection.js'

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() as current_time')
    console.log('✅ Conexión exitosa a PostgreSQL')
    console.log('Hora del servidor:', result.rows[0].current_time)
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
  } finally {
    await pool.end()
  }
}

testConnection()