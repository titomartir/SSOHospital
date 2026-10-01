import pool from '../db/connection.js'

export const recursoModel = {
  async getAll() {
    const result = await pool.query(
      'SELECT id, nombre FROM recursos ORDER BY nombre ASC'
    )
    return result.rows
  },

  async create(nombre) {
    const result = await pool.query(
      `INSERT INTO recursos (nombre, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       RETURNING id, nombre`,
      [nombre]
    )
    return result.rows[0]
  },

  async update(id, nombre) {
    const result = await pool.query(
      `UPDATE recursos
       SET nombre = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING id, nombre`,
      [nombre, id]
    )
    return result.rows[0] || null
  },

  async remove(id) {
    const result = await pool.query(
      'DELETE FROM recursos WHERE id = $1 RETURNING id',
      [id]
    )
    return Boolean(result.rows[0])
  },
}
