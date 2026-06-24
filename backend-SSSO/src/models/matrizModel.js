import pool from '../db/connection.js'

// Convierte una fila de la DB (snake_case) a camelCase para compatibilidad con el frontend
const toFrontend = (row) => ({
  id: row.id,
  fecha: row.fecha instanceof Date ? row.fecha.toISOString().split('T')[0] : row.fecha,
  subDireccionId: row.sub_direccion_id,
  subDireccion: row.sub_direccion,
  departamentoId: row.departamento_id,
  departamento: row.departamento,
  servicioId: row.servicio_id,
  servicio: row.servicio,
  puestoId: row.puesto_id,
  puesto: row.puesto || row.puesto_texto || '',
  funcionId: row.funcion_id,
  funcion: row.funcion || '',
  ubicacion: row.ubicacion,
  riesgoId: row.riesgo_id,
  riesgo: row.riesgo,
  peligroId: row.peligro_id,
  peligro: row.peligro,
  probabilidad: row.probabilidad,
  consecuencia: row.consecuencia,
  nivel: row.nivel,
  clasificacion: row.clasificacion,
  medidasPrev: row.medidas_prev,
  observaciones: row.observaciones ?? '',
})

export const matrizModel = {
  async getAll() {
    const result = await pool.query(
      `SELECT mr.id, mr.fecha, mr.sub_direccion_id, mr.departamento_id, mr.servicio_id, mr.puesto AS puesto_texto,
              mr.puesto_id, mr.funcion_id, mr.ubicacion, mr.peligro_id, mr.riesgo_id,
              mr.probabilidad, mr.consecuencia, mr.nivel, mr.clasificacion, mr.medidas_prev, mr.observaciones,
              sd.nombre AS sub_direccion, d.nombre AS departamento, s.nombre AS servicio,
              po.nombre AS puesto, fn.nombre AS funcion, r.nombre AS riesgo, p.nombre AS peligro
       FROM matriz_riesgos mr
       LEFT JOIN sub_direcciones sd ON sd.id = mr.sub_direccion_id
       LEFT JOIN departamentos d ON d.id = mr.departamento_id
       LEFT JOIN servicios s ON s.id = mr.servicio_id
       LEFT JOIN puestos po ON po.id = mr.puesto_id
       LEFT JOIN funciones fn ON fn.id = mr.funcion_id
       LEFT JOIN riesgos r ON r.id = mr.riesgo_id
       LEFT JOIN peligros p ON p.id = mr.peligro_id
       ORDER BY mr.id DESC`
    )
    return result.rows.map(toFrontend)
  },

  async create(data) {
    const { fecha, subDireccionId, departamentoId, servicioId, puestoId, funcionId, ubicacion, peligroId, riesgoId,
      probabilidad, consecuencia, nivel, clasificacion, medidasPrev, observaciones } = data

    const result = await pool.query(
      `INSERT INTO matriz_riesgos
        (fecha, sub_direccion_id, departamento_id, servicio_id, puesto_id, funcion_id, ubicacion, peligro_id, riesgo_id,
         probabilidad, consecuencia, nivel, clasificacion, medidas_prev, observaciones)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [fecha, Number(subDireccionId), Number(departamentoId), Number(servicioId), Number(puestoId), Number(funcionId),
       ubicacion, Number(peligroId), Number(riesgoId), Number(probabilidad), Number(consecuencia),
       nivel, clasificacion, medidasPrev, observaciones ?? '']
    )
    const fullResult = await pool.query(
      `SELECT mr.id, mr.fecha, mr.sub_direccion_id, mr.departamento_id, mr.servicio_id, mr.puesto AS puesto_texto,
              mr.puesto_id, mr.funcion_id, mr.ubicacion, mr.peligro_id, mr.riesgo_id,
              mr.probabilidad, mr.consecuencia, mr.nivel, mr.clasificacion, mr.medidas_prev, mr.observaciones,
              sd.nombre AS sub_direccion, d.nombre AS departamento, s.nombre AS servicio,
              po.nombre AS puesto, fn.nombre AS funcion, r.nombre AS riesgo, p.nombre AS peligro
       FROM matriz_riesgos mr
       LEFT JOIN sub_direcciones sd ON sd.id = mr.sub_direccion_id
       LEFT JOIN departamentos d ON d.id = mr.departamento_id
       LEFT JOIN servicios s ON s.id = mr.servicio_id
       LEFT JOIN puestos po ON po.id = mr.puesto_id
       LEFT JOIN funciones fn ON fn.id = mr.funcion_id
       LEFT JOIN riesgos r ON r.id = mr.riesgo_id
       LEFT JOIN peligros p ON p.id = mr.peligro_id
       WHERE mr.id = $1`,
      [result.rows[0].id]
    )
    return toFrontend(fullResult.rows[0])
  },

  async update(id, data) {
    const { fecha, subDireccionId, departamentoId, servicioId, puestoId, funcionId, ubicacion, peligroId, riesgoId,
      probabilidad, consecuencia, nivel, clasificacion, medidasPrev, observaciones } = data

    const result = await pool.query(
      `UPDATE matriz_riesgos SET
        fecha=$1, sub_direccion_id=$2, departamento_id=$3, servicio_id=$4, puesto_id=$5, funcion_id=$6,
        ubicacion=$7, peligro_id=$8, riesgo_id=$9, probabilidad=$10, consecuencia=$11, nivel=$12,
        clasificacion=$13, medidas_prev=$14, observaciones=$15
       WHERE id=$16 RETURNING *`,
      [fecha, Number(subDireccionId), Number(departamentoId), Number(servicioId), Number(puestoId), Number(funcionId),
       ubicacion, Number(peligroId), Number(riesgoId), Number(probabilidad), Number(consecuencia),
       nivel, clasificacion, medidasPrev, observaciones ?? '', id]
    )
    if (!result.rows[0]) return null
    const fullResult = await pool.query(
      `SELECT mr.id, mr.fecha, mr.sub_direccion_id, mr.departamento_id, mr.servicio_id, mr.puesto AS puesto_texto,
              mr.puesto_id, mr.funcion_id, mr.ubicacion, mr.peligro_id, mr.riesgo_id,
              mr.probabilidad, mr.consecuencia, mr.nivel, mr.clasificacion, mr.medidas_prev, mr.observaciones,
              sd.nombre AS sub_direccion, d.nombre AS departamento, s.nombre AS servicio,
              po.nombre AS puesto, fn.nombre AS funcion, r.nombre AS riesgo, p.nombre AS peligro
       FROM matriz_riesgos mr
       LEFT JOIN sub_direcciones sd ON sd.id = mr.sub_direccion_id
       LEFT JOIN departamentos d ON d.id = mr.departamento_id
       LEFT JOIN servicios s ON s.id = mr.servicio_id
       LEFT JOIN puestos po ON po.id = mr.puesto_id
       LEFT JOIN funciones fn ON fn.id = mr.funcion_id
       LEFT JOIN riesgos r ON r.id = mr.riesgo_id
       LEFT JOIN peligros p ON p.id = mr.peligro_id
       WHERE mr.id = $1`,
      [id]
    )
    return toFrontend(fullResult.rows[0])
  },

  async remove(id) {
    await pool.query('DELETE FROM matriz_riesgos WHERE id=$1', [id])
    return true
  },
}
