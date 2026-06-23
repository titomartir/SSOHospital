import pool from '../db/connection.js'

export const servicioModel = {
  async getByDepartamento(departamentoId) {
    const result = await pool.query(
      `SELECT id, nombre, departamento_id AS "departamentoId",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM servicios
       WHERE departamento_id = $1
       ORDER BY nombre ASC`,
      [departamentoId]
    )
    return result.rows
  },

  async create(nombre, departamentoId) {
    const result = await pool.query(
      `INSERT INTO servicios (nombre, departamento_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, nombre, departamento_id AS "departamentoId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, departamentoId]
    )
    return result.rows[0]
  },

  async update(id, payload) {
    const { nombre, departamentoId } = payload
    const result = await pool.query(
      `UPDATE servicios
       SET nombre = $1,
           departamento_id = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, nombre, departamento_id AS "departamentoId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, departamentoId, id]
    )
    return result.rows[0] || null
  },

  async remove(id) {
    await pool.query('DELETE FROM servicios WHERE id = $1', [id])
    return true
  },
}
