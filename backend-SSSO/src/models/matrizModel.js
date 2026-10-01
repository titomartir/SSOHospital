import pool from '../db/connection.js'
import { calculateRiskLevel, classifyRisk } from '../utils/calculators.js'

const formatDate = (value) => {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value).slice(0, 10)
}

const nullableId = (value) => (value === '' || value === null || value === undefined ? null : Number(value))

const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== ''

const parsePositiveInteger = (value, fieldName) => {
  if (!hasValue(value)) return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`El campo ${fieldName} debe ser un entero positivo`)
    error.code = 'VALIDATION_ERROR'
    throw error
  }
  return parsed
}

const resolveCatalogReference = async (client, fieldName, value, tableName, label) => {
  if (!hasValue(value)) return { id: null, nombre: null }

  const parsedId = parsePositiveInteger(value, fieldName)
  const result = await client.query(
    `SELECT id, nombre FROM ${tableName} WHERE id = $1`,
    [parsedId]
  )

  if (result.rows.length === 0) {
    const error = new Error(`El ${label} indicado no existe`)
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  return { id: parsedId, nombre: result.rows[0].nombre }
}

const validateRiesgoPeligroRelation = async (client, riesgoId, peligroId) => {
  const result = await client.query(
    `SELECT 1
     FROM peligros
     WHERE id = $1
       AND riesgo_id = $2`,
    [peligroId, riesgoId]
  )

  if (result.rows.length === 0) {
    const error = new Error('El peligro seleccionado no corresponde al riesgo indicado')
    error.code = 'VALIDATION_ERROR'
    throw error
  }
}

const resolvePeligroMedidaAccionContext = async (client, peligroId, peligroMedidaAccionId) => {
  const result = await client.query(
    `SELECT
       pma.id AS peligro_medida_accion_id,
       pm.id AS peligro_medida_id,
       mp.id AS medida_preventiva_id,
       mp.nombre AS medida_preventiva_nombre,
       a.id AS accion_id,
       a.nombre AS accion_nombre
     FROM peligro_medida_acciones pma
     INNER JOIN peligro_medidas pm ON pm.id = pma.peligro_medida_id
     INNER JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
     INNER JOIN acciones a ON a.id = pma.accion_id
     WHERE pma.id = $1
       AND pm.peligro_id = $2`,
    [peligroMedidaAccionId, peligroId]
  )

  if (result.rows.length === 0) {
    const error = new Error('La acción contextual no existe o no corresponde al peligro seleccionado')
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  return result.rows[0]
}

const fetchContextualRecursos = async (client, peligroMedidaAccionId) => {
  const result = await client.query(
    `SELECT DISTINCT
       r.id,
       r.nombre
     FROM peligro_medida_accion_recursos pmar
     INNER JOIN recursos r ON r.id = pmar.recurso_id
     WHERE pmar.peligro_medida_accion_id = $1
     ORDER BY r.nombre ASC`,
    [peligroMedidaAccionId]
  )

  return result.rows
}

const fetchContextualResponsables = async (client, peligroMedidaAccionId) => {
  const result = await client.query(
    `SELECT DISTINCT
       r.id,
       r.nombre,
       pmarp.tipo
     FROM peligro_medida_accion_responsables pmarp
     INNER JOIN responsables r ON r.id = pmarp.responsable_id
     WHERE pmarp.peligro_medida_accion_id = $1
     ORDER BY r.nombre ASC`,
    [peligroMedidaAccionId]
  )

  const principales = result.rows.filter((row) => row.tipo === 'PRINCIPAL')
  if (principales.length !== 1) {
    const error = new Error('Configuración inconsistente: la acción contextual debe tener exactamente un responsable PRINCIPAL')
    error.code = 'CONFIGURATION_ERROR'
    throw error
  }

  return {
    principal: principales[0],
    apoyos: result.rows.filter((row) => row.tipo === 'APOYO'),
  }
}

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
      peligroMedidaAccionId: data.peligroMedidaAccionId,
      medidaPreventivaId: data.medidaPreventivaId,
      medidasPrev: data.medidasPrev,
      accionId: data.accionId,
      acciones: data.acciones,
      recursoId: data.recursoId,
      recursos: data.recursos,
      responsableId: data.responsableId,
      responsable: data.responsable,
      fechaCumplimiento: data.fechaCumplimiento,
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
      const requiredFields = ['riesgoId', 'peligroId', 'peligroMedidaAccionId', 'probabilidad', 'consecuencia', 'fechaCumplimiento', 'estado']
      const missing = requiredFields.find((field) => riesgo[field] === null || riesgo[field] === undefined || String(riesgo[field]).trim() === '')
      if (missing) {
        const error = new Error(`Riesgo #${riskIndex + 1} incompleto en función #${index + 1}`)
        error.code = 'VALIDATION_ERROR'
        throw error
      }

      parsePositiveInteger(riesgo.riesgoId, 'riesgoId')
      parsePositiveInteger(riesgo.peligroId, 'peligroId')
      parsePositiveInteger(riesgo.peligroMedidaAccionId, 'peligroMedidaAccionId')

      if (hasValue(riesgo.medidaPreventivaId)) {
        const parsed = parsePositiveInteger(riesgo.medidaPreventivaId, 'medidaPreventivaId')
        if (!Number.isInteger(parsed) || parsed <= 0) {
          const error = new Error(`Riesgo #${riskIndex + 1} tiene medidaPreventivaId inválida en función #${index + 1}`)
          error.code = 'VALIDATION_ERROR'
          throw error
        }
      }
      if (hasValue(riesgo.accionId)) {
        const parsed = parsePositiveInteger(riesgo.accionId, 'accionId')
        if (!Number.isInteger(parsed) || parsed <= 0) {
          const error = new Error(`Riesgo #${riskIndex + 1} tiene accionId inválida en función #${index + 1}`)
          error.code = 'VALIDATION_ERROR'
          throw error
        }
      }
      if (hasValue(riesgo.recursoId)) {
        const parsed = parsePositiveInteger(riesgo.recursoId, 'recursoId')
        if (!Number.isInteger(parsed) || parsed <= 0) {
          const error = new Error(`Riesgo #${riskIndex + 1} tiene recursoId inválida en función #${index + 1}`)
          error.code = 'VALIDATION_ERROR'
          throw error
        }
      }
      if (hasValue(riesgo.responsableId)) {
        const parsed = parsePositiveInteger(riesgo.responsableId, 'responsableId')
        if (!Number.isInteger(parsed) || parsed <= 0) {
          const error = new Error(`Riesgo #${riskIndex + 1} tiene responsableId inválida en función #${index + 1}`)
          error.code = 'VALIDATION_ERROR'
          throw error
        }
      }

      if (hasValue(riesgo.medidasPrev) && String(riesgo.medidasPrev).length > 2000) {
        const error = new Error(`La medida preventiva del riesgo #${riskIndex + 1} excede 2000 caracteres`)
        error.code = 'VALIDATION_ERROR'
        throw error
      }
      if (hasValue(riesgo.acciones) && String(riesgo.acciones).length > 2000) {
        const error = new Error(`La acción del riesgo #${riskIndex + 1} excede 2000 caracteres`)
        error.code = 'VALIDATION_ERROR'
        throw error
      }
      if (hasValue(riesgo.recursos) && String(riesgo.recursos).length > 2000) {
        const error = new Error(`El recurso del riesgo #${riskIndex + 1} excede 2000 caracteres`)
        error.code = 'VALIDATION_ERROR'
        throw error
      }
      if (hasValue(riesgo.responsable) && String(riesgo.responsable).length > 2000) {
        const error = new Error(`El responsable del riesgo #${riskIndex + 1} excede 2000 caracteres`)
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

const toDetailRisk = (row) => {
  const medidasPrev = hasValue(row.medidas_prev) ? row.medidas_prev : (row.medida_preventiva_nombre ?? '')
  const acciones = hasValue(row.acciones) ? row.acciones : (row.accion_nombre ?? '')
  const recursosContextuales = Array.isArray(row.recursos_contextuales) ? row.recursos_contextuales : []
  const recursos = hasValue(row.recursos)
    ? row.recursos
    : (recursosContextuales.length > 0 ? recursosContextuales.map((item) => item.nombre).join(', ') : (row.recurso_nombre ?? ''))

  const responsablePrincipal = row.responsable_principal ?? null
  const responsablesApoyo = Array.isArray(row.responsables_apoyo) ? row.responsables_apoyo : []
  const responsable = hasValue(row.responsable)
    ? row.responsable
    : (responsablePrincipal?.nombre ?? (row.responsable_nombre ?? ''))

  return {
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
    peligroMedidaAccionId: row.peligro_medida_accion_id ?? null,
    medidaPreventivaId: row.medida_preventiva_id ?? null,
    medidaPreventivaNombre: row.medida_preventiva_nombre ?? null,
    accionId: row.accion_id ?? null,
    accionNombre: row.accion_nombre ?? null,
    recursoId: row.recurso_id ?? null,
    recursoNombre: row.recurso_nombre ?? null,
    responsableId: row.responsable_id ?? null,
    responsableNombre: row.responsable_nombre ?? null,
    medidasPrev,
    acciones,
    recursos,
    recursosContextuales,
    responsablePrincipal,
    responsablesApoyo,
    fechaCumplimiento: formatDate(row.fecha_cumplimiento),
    responsable,
    estado: row.estado ?? 'pendiente',
  }
}

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
      dr.peligro_medida_accion_id,
      dr.medida_preventiva_id,
      mp.nombre AS medida_preventiva_nombre,
      dr.accion_id,
      ac.nombre AS accion_nombre,
      dr.recurso_id,
      rc.nombre AS recurso_nombre,
      dr.responsable_id,
      resp.nombre AS responsable_nombre,
      dr.medidas_prev,
      dr.acciones,
      dr.recursos,
      dr.fecha_cumplimiento,
      dr.responsable,
      dr.estado
     FROM matriz_evaluacion_funciones ef
     LEFT JOIN funciones fn ON fn.id = ef.funcion_id
     LEFT JOIN matriz_evaluacion_detalles dr ON dr.evaluacion_funcion_id = ef.id
     LEFT JOIN medidas_preventivas mp ON mp.id = dr.medida_preventiva_id
     LEFT JOIN acciones ac ON ac.id = dr.accion_id
     LEFT JOIN recursos rc ON rc.id = dr.recurso_id
     LEFT JOIN responsables resp ON resp.id = dr.responsable_id
     LEFT JOIN riesgos r ON r.id = dr.riesgo_id
     LEFT JOIN peligros p ON p.id = dr.peligro_id
     WHERE ef.evaluacion_id = $1
     ORDER BY ef.orden ASC, ef.id ASC, dr.id ASC`,
    [id]
  )

  const detalleIds = details.rows
    .filter((row) => row.detalle_id)
    .map((row) => Number(row.detalle_id))

  const recursosByDetalle = new Map()
  const principalesByDetalle = new Map()
  const apoyosByDetalle = new Map()

  if (detalleIds.length > 0) {
    const recursosResult = await client.query(
      `SELECT
         mdr.detalle_id,
         r.id,
         r.nombre
       FROM matriz_detalle_recursos mdr
       INNER JOIN recursos r ON r.id = mdr.recurso_id
       WHERE mdr.detalle_id = ANY($1::int[])
       ORDER BY r.nombre ASC`,
      [detalleIds]
    )

    recursosResult.rows.forEach((row) => {
      const current = recursosByDetalle.get(row.detalle_id) ?? []
      if (!current.some((item) => item.id === row.id)) {
        current.push({ id: row.id, nombre: row.nombre })
      }
      recursosByDetalle.set(row.detalle_id, current)
    })

    const responsablesResult = await client.query(
      `SELECT
         mdr.detalle_id,
         resp.id,
         resp.nombre,
         mdr.tipo
       FROM matriz_detalle_responsables mdr
       INNER JOIN responsables resp ON resp.id = mdr.responsable_id
       WHERE mdr.detalle_id = ANY($1::int[])
       ORDER BY resp.nombre ASC`,
      [detalleIds]
    )

    responsablesResult.rows.forEach((row) => {
      if (row.tipo === 'PRINCIPAL') {
        const current = principalesByDetalle.get(row.detalle_id) ?? []
        if (!current.some((item) => item.id === row.id)) {
          current.push({ id: row.id, nombre: row.nombre })
        }
        principalesByDetalle.set(row.detalle_id, current)
        return
      }

      if (row.tipo === 'APOYO') {
        const current = apoyosByDetalle.get(row.detalle_id) ?? []
        if (!current.some((item) => item.id === row.id)) {
          current.push({ id: row.id, nombre: row.nombre })
        }
        apoyosByDetalle.set(row.detalle_id, current)
      }
    })
  }

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
      const principales = principalesByDetalle.get(row.detalle_id) ?? []

      if (row.peligro_medida_accion_id !== null && row.peligro_medida_accion_id !== undefined && principales.length !== 1) {
        const error = new Error('Configuración inconsistente: el detalle debe tener exactamente un responsable PRINCIPAL en matriz_detalle_responsables')
        error.code = 'CONFIGURATION_ERROR'
        throw error
      }

      const normalizedRow = {
        ...row,
        recursos_contextuales: recursosByDetalle.get(row.detalle_id) ?? [],
        responsable_principal: principales[0] ?? null,
        responsables_apoyo: apoyosByDetalle.get(row.detalle_id) ?? [],
      }

      funcionesMap.get(row.evaluacion_funcion_id).riesgosAsociados.push(toDetailRisk(normalizedRow))
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

      const riesgoId = parsePositiveInteger(item.riesgoId, 'riesgoId')
      const peligroId = parsePositiveInteger(item.peligroId, 'peligroId')
      const peligroMedidaAccionId = parsePositiveInteger(item.peligroMedidaAccionId, 'peligroMedidaAccionId')

      await validateRiesgoPeligroRelation(client, riesgoId, peligroId)

      const contexto = await resolvePeligroMedidaAccionContext(client, peligroId, peligroMedidaAccionId)
      const recursosContextuales = await fetchContextualRecursos(client, peligroMedidaAccionId)
      const responsablesContextuales = await fetchContextualResponsables(client, peligroMedidaAccionId)

      const recursoCompat = recursosContextuales[0]?.id ?? null
      const recursosText = recursosContextuales.map((recurso) => recurso.nombre).join(', ')
      const responsablePrincipal = responsablesContextuales.principal
      const responsablesApoyo = responsablesContextuales.apoyos

      const detailResult = await client.query(
        `INSERT INTO matriz_evaluacion_detalles
          (evaluacion_id, evaluacion_funcion_id, riesgo_id, peligro_id, probabilidad, consecuencia, nivel, clasificacion,
           peligro_medida_accion_id, medida_preventiva_id, accion_id, recurso_id, responsable_id, medidas_prev, acciones, recursos, fecha_cumplimiento, responsable, estado)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         RETURNING id`,
        [
          evaluacionId,
          evaluacionFuncionId,
          riesgoId,
          peligroId,
          Number(item.probabilidad),
          Number(item.consecuencia),
          nivel,
          clasificacion,
          contexto.peligro_medida_accion_id,
          contexto.medida_preventiva_id,
          contexto.accion_id,
          recursoCompat,
          responsablePrincipal.id,
          contexto.medida_preventiva_nombre,
          contexto.accion_nombre,
          recursosText,
          item.fechaCumplimiento || null,
          responsablePrincipal.nombre,
          item.estado || 'pendiente',
        ]
      )

      const detalleId = detailResult.rows[0].id

      for (const recurso of recursosContextuales) {
        await client.query(
          `INSERT INTO matriz_detalle_recursos
            (detalle_id, recurso_id)
           VALUES ($1, $2)`,
          [detalleId, recurso.id]
        )
      }

      await client.query(
        `INSERT INTO matriz_detalle_responsables
          (detalle_id, responsable_id, tipo)
         VALUES ($1, $2, $3)`,
        [detalleId, responsablePrincipal.id, 'PRINCIPAL']
      )

      for (const apoyo of responsablesApoyo) {
        await client.query(
          `INSERT INTO matriz_detalle_responsables
            (detalle_id, responsable_id, tipo)
           VALUES ($1, $2, $3)`,
          [detalleId, apoyo.id, 'APOYO']
        )
      }
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
