import pool from '../db/connection.js'

const toFrontend = (row) => ({
  id: row.id,
  evaluacionId: row.evaluacion_id,
  medida: row.medida,
  fechaCumplimiento: row.fecha_cumplimiento instanceof Date
    ? row.fecha_cumplimiento.toISOString().split('T')[0]
    : row.fecha_cumplimiento,
  responsable: row.responsable,
  estado: row.estado,
})

export const planificacionModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM planificaciones ORDER BY id DESC')
    return result.rows.map(toFrontend)
  },

  async create(data) {
    const { evaluacionId, medida, fechaCumplimiento, responsable, estado } = data
    const result = await pool.query(
      `INSERT INTO planificaciones (evaluacion_id, medida, fecha_cumplimiento, responsable, estado)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [evaluacionId, medida, fechaCumplimiento, responsable, estado ?? 'pendiente']
    )
    return toFrontend(result.rows[0])
  },

  async update(id, data) {
    const { evaluacionId, medida, fechaCumplimiento, responsable, estado } = data
    const result = await pool.query(
      `UPDATE planificaciones SET
        evaluacion_id=$1, medida=$2, fecha_cumplimiento=$3, responsable=$4, estado=$5
       WHERE id=$6 RETURNING *`,
      [evaluacionId, medida, fechaCumplimiento, responsable, estado, id]
    )
    return result.rows[0] ? toFrontend(result.rows[0]) : null
  },

  async remove(id) {
    await pool.query('DELETE FROM planificaciones WHERE id=$1', [id])
    return true
  },
}
