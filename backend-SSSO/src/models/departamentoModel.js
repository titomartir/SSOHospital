import pool from '../db/connection.js'

export const departamentoModel = {
  async getAll() {
    const result = await pool.query('SELECT nombre FROM departamentos ORDER BY nombre ASC')
    return result.rows.map((r) => r.nombre)
  },

  async create(nombre) {
    await pool.query(
      'INSERT INTO departamentos (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING',
      [nombre]
    )
    return this.getAll()
  },

  async remove(nombre) {
    await pool.query('DELETE FROM departamentos WHERE nombre = $1', [nombre])
    return this.getAll()
  },
}
