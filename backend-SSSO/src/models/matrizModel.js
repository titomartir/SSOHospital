import pool from '../db/connection.js'

// Convierte una fila de la DB (snake_case) a camelCase para compatibilidad con el frontend
const toFrontend = (row) => ({
  id: row.id,
  fecha: row.fecha instanceof Date ? row.fecha.toISOString().split('T')[0] : row.fecha,
  departamento: row.departamento,
  puesto: row.puesto,
  ubicacion: row.ubicacion,
  actividad: row.actividad,
  peligro: row.peligro,
  riesgo: row.riesgo,
  probabilidad: row.probabilidad,
  consecuencia: row.consecuencia,
  nivel: row.nivel,
  clasificacion: row.clasificacion,
  medidasPrev: row.medidas_prev,
  observaciones: row.observaciones ?? '',
})

export const matrizModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM matriz_riesgos ORDER BY id DESC')
    return result.rows.map(toFrontend)
  },

  async create(data) {
    const { fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo,
      probabilidad, consecuencia, nivel, clasificacion, medidasPrev, observaciones } = data

    const result = await pool.query(
      `INSERT INTO matriz_riesgos
        (fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo,
         probabilidad, consecuencia, nivel, clasificacion, medidas_prev, observaciones)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo,
       probabilidad, consecuencia, nivel, clasificacion, medidasPrev, observaciones ?? '']
    )
    return toFrontend(result.rows[0])
  },

  async update(id, data) {
    const { fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo,
      probabilidad, consecuencia, nivel, clasificacion, medidasPrev, observaciones } = data

    const result = await pool.query(
      `UPDATE matriz_riesgos SET
        fecha=$1, departamento=$2, puesto=$3, ubicacion=$4, actividad=$5, peligro=$6,
        riesgo=$7, probabilidad=$8, consecuencia=$9, nivel=$10, clasificacion=$11,
        medidas_prev=$12, observaciones=$13
       WHERE id=$14 RETURNING *`,
      [fecha, departamento, puesto, ubicacion, actividad, peligro, riesgo,
       probabilidad, consecuencia, nivel, clasificacion, medidasPrev, observaciones ?? '', id]
    )
    return result.rows[0] ? toFrontend(result.rows[0]) : null
  },

  async remove(id) {
    await pool.query('DELETE FROM matriz_riesgos WHERE id=$1', [id])
    return true
  },
}
