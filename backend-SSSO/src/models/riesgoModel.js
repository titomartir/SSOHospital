import pool from '../db/connection.js'

export const riesgoModel = {
  async getAll() {
    const result = await pool.query('SELECT nombre FROM riesgos ORDER BY nombre ASC')
    return result.rows.map((r) => r.nombre)
  },

  async create(nombre) {
    await pool.query(
      'INSERT INTO riesgos (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING',
      [nombre]
    )
    return this.getAll()
  },

  async remove(nombre) {
    await pool.query('DELETE FROM riesgos WHERE nombre = $1', [nombre])
    return this.getAll()
  },
}
