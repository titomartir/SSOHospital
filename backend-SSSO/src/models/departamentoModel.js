import pool from '../db/connection.js'

export const departamentoModel = {
  async getAll() {
    const result = await pool.query('SELECT nombre FROM departamentos ORDER BY nombre ASC')
    return result.rows.map((r) => r.nombre)
  },

  async getAllDetailed() {
    const result = await pool.query(
      `SELECT d.id, d.nombre,
              d.sub_direccion_id AS "subDireccionId",
              sd.nombre AS "subDireccionNombre"
       FROM departamentos d
       JOIN sub_direcciones sd ON sd.id = d.sub_direccion_id
       ORDER BY d.nombre ASC`
    )
    return result.rows
  },

  async create(nombre, subDireccionId) {
    const result = await pool.query(
      `INSERT INTO departamentos (nombre, sub_direccion_id)
       VALUES ($1, $2)
       RETURNING id, nombre, sub_direccion_id AS "subDireccionId"`,
      [nombre, subDireccionId]
    )
    return result.rows[0]
  },

  async update(id, payload) {
    const { nombre, subDireccionId } = payload
    const result = await pool.query(
      `UPDATE departamentos
       SET nombre = $1,
           sub_direccion_id = $2
       WHERE id = $3
       RETURNING id, nombre, sub_direccion_id AS "subDireccionId"`,
      [nombre, subDireccionId, id]
    )
    return result.rows[0] || null
  },

  async removeById(id) {
    await pool.query('DELETE FROM departamentos WHERE id = $1', [id])
    return true
  },

  async remove(nombre) {
    await pool.query('DELETE FROM departamentos WHERE nombre = $1', [nombre])
    return this.getAll()
  },
}
