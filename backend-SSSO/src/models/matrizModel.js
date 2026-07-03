import pool from '../db/connection.js'
import { calculateRiskLevel, classifyRisk } from '../utils/calculators.js'

const formatDate = (value) => {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value).slice(0, 10)
}

const nullableId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))

const normalizeRiesgos = (data) => {
  if (Array.isArray(data.riesgosAsociados) && data.riesgosAsociados.length > 0) {
    return data.riesgosAsociados
  }

  if (data.riesgoId || data.peligroId) {
    return [{
      riesgoId: data.riesgoId,
      peligroId: data.peligroId,
      probabilidad: data.probabilidad,
      consecuencia: data.consecuencia,
      medidasPrev: data.medidasPrev,
      acciones: data.acciones,
      recursos: data.recursos,
      fechaCumplimiento: data.fechaCumplimiento,
      responsable: data.responsable,
      estado: data.estado,
    }]
  }

  return []
}

const normalizeFunciones = (data) => {
  if (Array.isArray(data.funciones) && data.funciones.length > 0) {
    return data.funciones.map((item) => ({
      funcionId: nullableId(item.funcionId),
      riesgosAsociados: normalizeRiesgos(item),
    }))
  }

  return [{
    funcionId: nullableId(data.funcionId),
    riesgosAsociados: normalizeRiesgos(data),
  }]
}

const validateFuncionesPayload = (funciones = []) => {
  if (!Array.isArray(funciones) || funciones.length === 0) {
    const error = new Error('Debe agregar al menos una función')
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  funciones.forEach((funcion, index) => {
    if (!funcion.funcionId) {
      const error = new Error(`La función #${index + 1} es obligatoria`)
      error.code = 'VALIDATION_ERROR'
      throw error
    }

    if (!Array.isArray(funcion.riesgosAsociados) || funcion.riesgosAsociados.length === 0) {
      const error = new Error(`Debe agregar al menos un riesgo en la función #${index + 1}`)
      error.code = 'VALIDATION_ERROR'
      throw error
    }

    funcion.riesgosAsociados.forEach((riesgo, riskIndex) => {
      const requiredFields = ['riesgoId', 'peligroId', 'probabilidad', 'consecuencia', 'medidasPrev', 'acciones', 'recursos', 'fechaCumplimiento', 'responsable', 'estado']
      const missing = requiredFields.find((field) => riesgo[field] === null || riesgo[field] === undefined || String(riesgo[field]).trim() === '')
      if (missing) {
        const error = new Error(`Riesgo #${riskIndex + 1} incompleto en función #${index + 1}`)
        error.code = 'VALIDATION_ERROR'
        throw error
      }
    })
  })
}

const toSummary = (row) => {
  const nivel = Number(row.nivel ?? 0)
  const hasRisks = Number(row.riesgos_count ?? 0) > 0
  return {
    id: row.id,
    fecha: formatDate(row.fecha),
    subDireccionId: row.sub_direccion_id,
    subDireccion: row.sub_direccion,
    departamentoId: row.departamento_id,
    departamento: row.departamento,
    servicioId: row.servicio_id,
    servicio: row.servicio,
    puestoId: row.puesto_id,
    puesto: row.puesto || '',
    ubicacion: row.ubicacion,
    estado: row.estado ?? 'pendiente',
    observaciones: row.observaciones ?? '',
    funcionesCount: Number(row.funciones_count ?? 0),
    riesgosCount: Number(row.riesgos_count ?? 0),
    nivel: hasRisks ? nivel : null,
    clasificacion: hasRisks ? classifyRisk(nivel) : 'N/A',
  }
}

const toDetailRisk = (row) => ({
  id: row.detalle_id,
  evaluacionId: row.evaluacion_id,
  evaluacionFuncionId: row.evaluacion_funcion_id,
  riesgoId: row.riesgo_id,
  riesgo: row.riesgo,
  peligroId: row.peligro_id,
  peligro: row.peligro,
  probabilidad: row.probabilidad,
  consecuencia: row.consecuencia,
  nivel: row.nivel,
  clasificacion: row.clasificacion,
  medidasPrev: row.medidas_prev,
  acciones: row.acciones ?? '',
  recursos: row.recursos ?? '',
  fechaCumplimiento: formatDate(row.fecha_cumplimiento),
  responsable: row.responsable ?? '',
  estado: row.estado ?? 'pendiente',
})

const fetchSummaryById = async (client, id) => {
  const result = await client.query(
    `SELECT
      e.id,
      e.fecha,
      e.sub_direccion_id,
      e.departamento_id,
      e.servicio_id,
      e.puesto_id,
      e.ubicacion,
      e.estado,
      e.observaciones,
      sd.nombre AS sub_direccion,
      d.nombre AS departamento,
      s.nombre AS servicio,
      po.nombre AS puesto,
      COALESCE((SELECT COUNT(*) FROM matriz_evaluacion_funciones ef WHERE ef.evaluacion_id = e.id), 0) AS funciones_count,
      COALESCE((SELECT COUNT(*) FROM matriz_evaluacion_detalles dr WHERE dr.evaluacion_id = e.id), 0) AS riesgos_count,
      COALESCE((SELECT MAX(dr.nivel) FROM matriz_evaluacion_detalles dr WHERE dr.evaluacion_id = e.id), 0) AS nivel
    FROM matriz_evaluaciones e
    LEFT JOIN sub_direcciones sd ON sd.id = e.sub_direccion_id
    LEFT JOIN departamentos d ON d.id = e.departamento_id
    LEFT JOIN servicios s ON s.id = e.servicio_id
    LEFT JOIN puestos po ON po.id = e.puesto_id
    WHERE e.id = $1`,
    [id]
  )

  return result.rows[0] ? toSummary(result.rows[0]) : null
}

const fetchDetailById = async (client, id) => {
  const summary = await fetchSummaryById(client, id)
  if (!summary) return null

  const details = await client.query(
    `SELECT
      ef.id AS evaluacion_funcion_id,
      ef.evaluacion_id,
      ef.funcion_id,
      ef.orden,
      fn.nombre AS funcion,
      dr.id AS detalle_id,
      dr.riesgo_id,
      r.nombre AS riesgo,
      dr.peligro_id,
      p.nombre AS peligro,
      dr.probabilidad,
      dr.consecuencia,
      dr.nivel,
      dr.clasificacion,
      dr.medidas_prev,
      dr.acciones,
      dr.recursos,
      dr.fecha_cumplimiento,
      dr.responsable,
      dr.estado
     FROM matriz_evaluacion_funciones ef
     LEFT JOIN funciones fn ON fn.id = ef.funcion_id
     LEFT JOIN matriz_evaluacion_detalles dr ON dr.evaluacion_funcion_id = ef.id
     LEFT JOIN riesgos r ON r.id = dr.riesgo_id
     LEFT JOIN peligros p ON p.id = dr.peligro_id
     WHERE ef.evaluacion_id = $1
     ORDER BY ef.orden ASC, ef.id ASC, dr.id ASC`,
    [id]
  )

  const funcionesMap = new Map()

  details.rows.forEach((row) => {
    if (!funcionesMap.has(row.evaluacion_funcion_id)) {
      funcionesMap.set(row.evaluacion_funcion_id, {
        id: row.evaluacion_funcion_id,
        evaluacionId: row.evaluacion_id,
        funcionId: row.funcion_id,
        funcion: row.funcion || '',
        orden: row.orden,
        riesgosAsociados: [],
      })
    }

    if (row.detalle_id) {
      funcionesMap.get(row.evaluacion_funcion_id).riesgosAsociados.push(toDetailRisk(row))
    }
  })

  const funciones = [...funcionesMap.values()]
  const riesgosAsociados = funciones.flatMap((funcion) => funcion.riesgosAsociados)

  return {
    ...summary,
    funciones,
    riesgosAsociados,
  }
}

const insertFuncionesYDetalles = async (client, evaluacionId, funciones) => {
  for (let index = 0; index < funciones.length; index += 1) {
    const funcion = funciones[index]
    const funcionResult = await client.query(
      `INSERT INTO matriz_evaluacion_funciones
        (evaluacion_id, funcion_id, orden)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [evaluacionId, funcion.funcionId, index + 1]
    )

    const evaluacionFuncionId = funcionResult.rows[0].id

    for (const item of funcion.riesgosAsociados) {
      const nivel = calculateRiskLevel(item.probabilidad, item.consecuencia)
      const clasificacion = classifyRisk(nivel)

      await client.query(
        `INSERT INTO matriz_evaluacion_detalles
          (evaluacion_id, evaluacion_funcion_id, riesgo_id, peligro_id, probabilidad, consecuencia, nivel, clasificacion,
           medidas_prev, acciones, recursos, fecha_cumplimiento, responsable, estado)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          evaluacionId,
          evaluacionFuncionId,
          Number(item.riesgoId),
          Number(item.peligroId),
          Number(item.probabilidad),
          Number(item.consecuencia),
          nivel,
          clasificacion,
          item.medidasPrev ?? '',
          item.acciones ?? '',
          item.recursos ?? '',
          item.fechaCumplimiento || null,
          item.responsable ?? '',
          item.estado || 'pendiente',
        ]
      )
    }
  }
}

export const matrizModel = {
  async getAll() {
    const result = await pool.query(
      `SELECT
        e.id,
        e.fecha,
        e.sub_direccion_id,
        e.departamento_id,
        e.servicio_id,
        e.puesto_id,
        e.ubicacion,
        e.estado,
        e.observaciones,
        sd.nombre AS sub_direccion,
        d.nombre AS departamento,
        s.nombre AS servicio,
        po.nombre AS puesto,
        COALESCE((SELECT COUNT(*) FROM matriz_evaluacion_funciones ef WHERE ef.evaluacion_id = e.id), 0) AS funciones_count,
        COALESCE((SELECT COUNT(*) FROM matriz_evaluacion_detalles dr WHERE dr.evaluacion_id = e.id), 0) AS riesgos_count,
        COALESCE((SELECT MAX(dr.nivel) FROM matriz_evaluacion_detalles dr WHERE dr.evaluacion_id = e.id), 0) AS nivel
       FROM matriz_evaluaciones e
       LEFT JOIN sub_direcciones sd ON sd.id = e.sub_direccion_id
       LEFT JOIN departamentos d ON d.id = e.departamento_id
       LEFT JOIN servicios s ON s.id = e.servicio_id
       LEFT JOIN puestos po ON po.id = e.puesto_id
       ORDER BY e.id DESC`
    )

    return result.rows.map(toSummary)
  },

  async getById(id) {
    const client = await pool.connect()
    try {
      return await fetchDetailById(client, id)
    } finally {
      client.release()
    }
  },

  async create(data) {
    const funciones = normalizeFunciones(data)
    validateFuncionesPayload(funciones)

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const mainResult = await client.query(
        `INSERT INTO matriz_evaluaciones
          (fecha, sub_direccion_id, departamento_id, servicio_id, puesto_id, funcion_id, ubicacion, estado, observaciones)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING id`,
        [
          data.fecha,
          Number(data.subDireccionId),
          Number(data.departamentoId),
          Number(data.servicioId),
          nullableId(data.puestoId),
          nullableId(funciones[0]?.funcionId),
          data.ubicacion,
          data.estado || 'pendiente',
          data.observaciones ?? '',
        ]
      )

      const evaluacionId = mainResult.rows[0].id
      await insertFuncionesYDetalles(client, evaluacionId, funciones)

      await client.query('COMMIT')
      return await fetchDetailById(client, evaluacionId)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  },

  async update(id, data) {
    const funciones = normalizeFunciones(data)
    validateFuncionesPayload(funciones)

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const updateResult = await client.query(
        `UPDATE matriz_evaluaciones SET
          fecha=$1,
          sub_direccion_id=$2,
          departamento_id=$3,
          servicio_id=$4,
          puesto_id=$5,
          funcion_id=$6,
          ubicacion=$7,
          estado=$8,
          observaciones=$9,
          updated_at = NOW()
         WHERE id=$10
         RETURNING id`,
        [
          data.fecha,
          Number(data.subDireccionId),
          Number(data.departamentoId),
          Number(data.servicioId),
          nullableId(data.puestoId),
          nullableId(funciones[0]?.funcionId),
          data.ubicacion,
          data.estado || 'pendiente',
          data.observaciones ?? '',
          id,
        ]
      )

      if (!updateResult.rows[0]) {
        await client.query('ROLLBACK')
        return null
      }

      await client.query('DELETE FROM matriz_evaluacion_funciones WHERE evaluacion_id = $1', [id])
      await insertFuncionesYDetalles(client, Number(id), funciones)

      await client.query('COMMIT')
      return await fetchDetailById(client, id)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  },

  async remove(id) {
    await pool.query('DELETE FROM matriz_evaluaciones WHERE id = $1', [id])
    return true
  },
}
