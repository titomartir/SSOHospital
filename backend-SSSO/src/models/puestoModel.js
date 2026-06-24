import pool from '../db/connection.js'

export const puestoModel = {
  async getAll() {
    const result = await pool.query(
      `SELECT id, nombre, servicio_id AS "servicioId",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM puestos ORDER BY nombre ASC`
    )
    return result.rows
  },

  async create(nombre, servicioId) {
    const result = await pool.query(
      `INSERT INTO puestos (nombre, servicio_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, nombre, servicio_id AS "servicioId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, servicioId]
    )
    return result.rows[0]
  },

  async update(id, nombre, servicioId) {
    const result = await pool.query(
      `UPDATE puestos
       SET nombre = $1,
           servicio_id = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, nombre, servicio_id AS "servicioId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, servicioId, id]
    )
    return result.rows[0] || null
  },

  async remove(id) {
    await pool.query('DELETE FROM puestos WHERE id = $1', [id])
    return true
  },
}
