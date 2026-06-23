import pool from '../db/connection.js'

export const catalogoEstructuraModel = {
  async getTree() {
    const result = await pool.query(
      `SELECT
         sd.id AS sub_direccion_id,
         sd.nombre AS sub_direccion_nombre,
         d.id AS departamento_id,
         d.nombre AS departamento_nombre,
         s.id AS servicio_id,
         s.nombre AS servicio_nombre
       FROM sub_direcciones sd
       LEFT JOIN departamentos d ON d.sub_direccion_id = sd.id
       LEFT JOIN servicios s ON s.departamento_id = d.id
       ORDER BY sd.nombre ASC, d.nombre ASC, s.nombre ASC`
    )

    const subDireccionMap = new Map()

    result.rows.forEach((row) => {
      if (!subDireccionMap.has(row.sub_direccion_id)) {
        subDireccionMap.set(row.sub_direccion_id, {
          id: row.sub_direccion_id,
          nombre: row.sub_direccion_nombre,
          departamentos: [],
        })
      }

      if (!row.departamento_id) return

      const subDir = subDireccionMap.get(row.sub_direccion_id)
      let dep = subDir.departamentos.find((item) => item.id === row.departamento_id)
      if (!dep) {
        dep = {
          id: row.departamento_id,
          nombre: row.departamento_nombre,
          subDireccionId: row.sub_direccion_id,
          servicios: [],
        }
        subDir.departamentos.push(dep)
      }

      if (row.servicio_id) {
        dep.servicios.push({
          id: row.servicio_id,
          nombre: row.servicio_nombre,
          departamentoId: row.departamento_id,
        })
      }
    })

    return Array.from(subDireccionMap.values())
  },
}
