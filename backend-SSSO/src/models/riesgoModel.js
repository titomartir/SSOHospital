import pool from '../db/connection.js'

export const riesgoModel = {
  async getAll() {
    const result = await pool.query('SELECT nombre FROM riesgos ORDER BY nombre ASC')
    return result.rows.map((r) => r.nombre)
  },

  async getAllDetailed() {
    const result = await pool.query(
      'SELECT id, nombre, created_at AS "createdAt", updated_at AS "updatedAt" FROM riesgos ORDER BY nombre ASC'
    )
    return result.rows
  },

  async create(nombre) {
    const result = await pool.query(
      `INSERT INTO riesgos (nombre, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       RETURNING id, nombre, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre]
    )
    return result.rows[0]
  },

  async update(id, nombre) {
    const result = await pool.query(
      `UPDATE riesgos
       SET nombre = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING id, nombre, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, id]
    )
    return result.rows[0] || null
  },

  async removeById(id) {
    await pool.query('DELETE FROM riesgos WHERE id = $1', [id])
    return true
  },

  async remove(nombre) {
    await pool.query('DELETE FROM riesgos WHERE nombre = $1', [nombre])
    return this.getAll()
  },
}
