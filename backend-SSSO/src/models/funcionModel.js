import pool from '../db/connection.js'

export const funcionModel = {
  async getByPuesto(puestoId) {
    const result = await pool.query(
      `SELECT id, nombre, puesto_id AS "puestoId",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM funciones
       WHERE puesto_id = $1
       ORDER BY nombre ASC`,
      [puestoId]
    )
    return result.rows
  },

  async create(nombre, puestoId) {
    const result = await pool.query(
      `INSERT INTO funciones (nombre, puesto_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, nombre, puesto_id AS "puestoId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, puestoId]
    )
    return result.rows[0]
  },

  async update(id, payload) {
    const { nombre, puestoId } = payload
    const result = await pool.query(
      `UPDATE funciones
       SET nombre = $1,
           puesto_id = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, nombre, puesto_id AS "puestoId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, puestoId, id]
    )
    return result.rows[0] || null
  },

  async remove(id) {
    await pool.query('DELETE FROM funciones WHERE id = $1', [id])
    return true
  },
}
