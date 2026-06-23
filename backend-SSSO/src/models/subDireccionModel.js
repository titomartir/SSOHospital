import pool from '../db/connection.js'

export const subDireccionModel = {
  async getAll() {
    const result = await pool.query(
      'SELECT id, nombre, created_at AS "createdAt", updated_at AS "updatedAt" FROM sub_direcciones ORDER BY nombre ASC'
    )
    return result.rows
  },

  async create(nombre) {
    const result = await pool.query(
      `INSERT INTO sub_direcciones (nombre, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       RETURNING id, nombre, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre]
    )
    return result.rows[0]
  },

  async update(id, nombre) {
    const result = await pool.query(
      `UPDATE sub_direcciones
       SET nombre = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, nombre, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, id]
    )
    return result.rows[0] || null
  },

  async remove(id) {
    await pool.query('DELETE FROM sub_direcciones WHERE id = $1', [id])
    return true
  },
}
