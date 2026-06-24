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
         s.nombre AS servicio_nombre,
         p.id AS puesto_id,
         p.nombre AS puesto_nombre,
         f.id AS funcion_id,
         f.nombre AS funcion_nombre
       FROM sub_direcciones sd
       LEFT JOIN departamentos d ON d.sub_direccion_id = sd.id
       LEFT JOIN servicios s ON s.departamento_id = d.id
       LEFT JOIN puestos p ON p.servicio_id = s.id
       LEFT JOIN funciones f ON f.puesto_id = p.id
       ORDER BY sd.nombre ASC, d.nombre ASC, s.nombre ASC, p.nombre ASC, f.nombre ASC`
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

      if (!row.servicio_id) return
      let srv = dep.servicios.find((item) => item.id === row.servicio_id)
      if (!srv) {
        srv = {
          id: row.servicio_id,
          nombre: row.servicio_nombre,
          departamentoId: row.departamento_id,
          puestos: [],
        }
        dep.servicios.push(srv)
      }

      if (!row.puesto_id) return
      let pue = srv.puestos.find((item) => item.id === row.puesto_id)
      if (!pue) {
        pue = {
          id: row.puesto_id,
          nombre: row.puesto_nombre,
          servicioId: row.servicio_id,
          funciones: [],
        }
        srv.puestos.push(pue)
      }

      if (row.funcion_id) {
        pue.funciones.push({
          id: row.funcion_id,
          nombre: row.funcion_nombre,
          puestoId: row.puesto_id,
        })
      }
    })

    return Array.from(subDireccionMap.values())
  },
}
