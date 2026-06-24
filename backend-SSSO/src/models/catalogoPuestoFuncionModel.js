import pool from '../db/connection.js'

export const catalogoPuestoFuncionModel = {
  async getTree() {
    const result = await pool.query(
      `SELECT
         p.id AS puesto_id,
         p.nombre AS puesto_nombre,
         f.id AS funcion_id,
         f.nombre AS funcion_nombre
       FROM puestos p
       LEFT JOIN funciones f ON f.puesto_id = p.id
       ORDER BY p.nombre ASC, f.nombre ASC`
    )

    const puestoMap = new Map()

    result.rows.forEach((row) => {
      if (!puestoMap.has(row.puesto_id)) {
        puestoMap.set(row.puesto_id, {
          id: row.puesto_id,
          nombre: row.puesto_nombre,
          funciones: [],
        })
      }

      if (!row.funcion_id) return

      const puesto = puestoMap.get(row.puesto_id)
      puesto.funciones.push({
        id: row.funcion_id,
        nombre: row.funcion_nombre,
        puestoId: row.puesto_id,
      })
    })

    return Array.from(puestoMap.values())
  },
}
