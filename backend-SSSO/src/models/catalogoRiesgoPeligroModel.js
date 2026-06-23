import pool from '../db/connection.js'

export const catalogoRiesgoPeligroModel = {
  async getTree() {
    const result = await pool.query(
      `SELECT
         r.id AS riesgo_id,
         r.nombre AS riesgo_nombre,
         p.id AS peligro_id,
         p.nombre AS peligro_nombre
       FROM riesgos r
       LEFT JOIN peligros p ON p.riesgo_id = r.id
       ORDER BY r.nombre ASC, p.nombre ASC`
    )

    const riesgoMap = new Map()

    result.rows.forEach((row) => {
      if (!riesgoMap.has(row.riesgo_id)) {
        riesgoMap.set(row.riesgo_id, {
          id: row.riesgo_id,
          nombre: row.riesgo_nombre,
          peligros: [],
        })
      }

      if (!row.peligro_id) return

      const riesgo = riesgoMap.get(row.riesgo_id)
      riesgo.peligros.push({
        id: row.peligro_id,
        nombre: row.peligro_nombre,
        riesgoId: row.riesgo_id,
      })
    })

    return Array.from(riesgoMap.values())
  },
}
