import pool from '../db/connection.js'

const buildFilters = (filters = {}) => {
  const evalConditions = []
  const detailConditions = []
  const params = []

  const addParam = (value) => {
    params.push(value)
    return `$${params.length}`
  }

  if (filters.fechaDesde) {
    evalConditions.push(`e.fecha >= ${addParam(filters.fechaDesde)}`)
  }

  if (filters.fechaHasta) {
    evalConditions.push(`e.fecha <= ${addParam(filters.fechaHasta)}`)
  }

  if (filters.subDireccion) {
    evalConditions.push(`sd.nombre = ${addParam(filters.subDireccion)}`)
  }

  if (filters.departamento) {
    evalConditions.push(`dep.nombre = ${addParam(filters.departamento)}`)
  }

  if (filters.clasificacion) {
    detailConditions.push(`d.clasificacion = ${addParam(filters.clasificacion)}`)
  }

  if (filters.estado) {
    detailConditions.push(`d.estado = ${addParam(filters.estado)}`)
  }

  if (filters.responsable) {
    detailConditions.push(`COALESCE(d.responsable, '') = ${addParam(filters.responsable)}`)
  }

  return {
    params,
    evalWhere: evalConditions.length > 0 ? `WHERE ${evalConditions.join(' AND ')}` : '',
    detailWhere: detailConditions.length > 0 ? `AND ${detailConditions.join(' AND ')}` : '',
  }
}

export const dashboardModel = {
  async getOverview(filters = {}) {
    const { params, evalWhere, detailWhere } = buildFilters(filters)

    const result = await pool.query(
      `WITH evaluaciones AS (
          SELECT
            e.id AS evaluacion_id,
            e.fecha,
            e.ubicacion,
            sd.nombre AS sub_direccion,
            dep.nombre AS departamento,
            srv.nombre AS servicio,
            pu.nombre AS puesto
          FROM matriz_evaluaciones e
          LEFT JOIN sub_direcciones sd ON sd.id = e.sub_direccion_id
          LEFT JOIN departamentos dep ON dep.id = e.departamento_id
          LEFT JOIN servicios srv ON srv.id = e.servicio_id
          LEFT JOIN puestos pu ON pu.id = e.puesto_id
          ${evalWhere}
        ),
        detalles AS (
          SELECT
            ev.evaluacion_id,
            ev.fecha,
            ev.ubicacion,
            ev.sub_direccion,
            ev.departamento,
            ev.servicio,
            ev.puesto,
            fu.nombre AS funcion,
            d.id AS detalle_id,
            d.riesgo_id,
            r.nombre AS riesgo,
            d.peligro_id,
            p.nombre AS peligro,
            d.probabilidad,
            d.consecuencia,
            d.nivel,
            d.clasificacion,
            d.estado,
            d.responsable,
            d.recursos,
            d.fecha_cumplimiento
          FROM evaluaciones ev
          LEFT JOIN matriz_evaluacion_funciones ef ON ef.evaluacion_id = ev.evaluacion_id
          LEFT JOIN funciones fu ON fu.id = ef.funcion_id
          LEFT JOIN matriz_evaluacion_detalles d ON d.evaluacion_funcion_id = ef.id
          LEFT JOIN riesgos r ON r.id = d.riesgo_id
          LEFT JOIN peligros p ON p.id = d.peligro_id
          WHERE d.id IS NOT NULL
          ${detailWhere}
        )
        SELECT
          (
            SELECT json_build_object(
              'totalEvaluaciones', COALESCE(COUNT(DISTINCT evaluacion_id), 0),
              'totalRiesgosAsociados', COALESCE(COUNT(detalle_id), 0),
              'riesgosMuyAltos', COALESCE(COUNT(*) FILTER (WHERE clasificacion = 'Muy alto'), 0),
              'riesgosAltos', COALESCE(COUNT(*) FILTER (WHERE clasificacion = 'Alto'), 0),
              'riesgosMedios', COALESCE(COUNT(*) FILTER (WHERE clasificacion = 'Medio'), 0),
              'riesgosBajos', COALESCE(COUNT(*) FILTER (WHERE clasificacion = 'Bajo'), 0),
              'accionesPendientes', COALESCE(COUNT(*) FILTER (
                WHERE estado IN ('pendiente', 'en proceso')
                  AND (fecha_cumplimiento IS NULL OR fecha_cumplimiento >= CURRENT_DATE)
              ), 0),
              'accionesFinalizadas', COALESCE(COUNT(*) FILTER (WHERE estado = 'completado'), 0),
              'accionesVencidas', COALESCE(COUNT(*) FILTER (
                WHERE estado <> 'completado'
                  AND fecha_cumplimiento IS NOT NULL
                  AND fecha_cumplimiento < CURRENT_DATE
              ), 0),
              'porcentajeCumplimiento', COALESCE(ROUND(
                (COUNT(*) FILTER (WHERE estado = 'completado')::numeric / NULLIF(COUNT(*), 0)) * 100,
                2
              ), 0),
              'departamentosEvaluados', COALESCE(COUNT(DISTINCT departamento), 0),
              'funcionesEvaluadas', COALESCE(COUNT(DISTINCT funcion), 0)
            )
            FROM detalles
          ) AS kpis,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT clasificacion AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY clasificacion
            ) t
          ) AS distribucionClasificacion,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT departamento AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY departamento
            ) t
          ) AS riesgosPorDepartamento,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT riesgo AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY riesgo
            ) t
          ) AS riesgosPorTipo,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT sub_direccion AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY sub_direccion
            ) t
          ) AS riesgosPorSubdireccion,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.month), '[]'::json)
            FROM (
              SELECT to_char(date_trunc('month', fecha), 'YYYY-MM') AS month,
                     COUNT(DISTINCT evaluacion_id)::int AS value
              FROM detalles
              GROUP BY date_trunc('month', fecha)
            ) t
          ) AS evolucionMensual,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT COALESCE(puesto, 'Sin puesto') AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY COALESCE(puesto, 'Sin puesto')
            ) t
          ) AS riesgosPorPuesto,
          (
            SELECT json_build_array(
              json_build_object('name', 'Finalizadas', 'value', COALESCE(COUNT(*) FILTER (WHERE estado = 'completado'), 0)),
              json_build_object('name', 'Pendientes', 'value', COALESCE(COUNT(*) FILTER (
                WHERE estado IN ('pendiente', 'en proceso')
                  AND (fecha_cumplimiento IS NULL OR fecha_cumplimiento >= CURRENT_DATE)
              ), 0)),
              json_build_object('name', 'Vencidas', 'value', COALESCE(COUNT(*) FILTER (
                WHERE estado <> 'completado'
                  AND fecha_cumplimiento IS NOT NULL
                  AND fecha_cumplimiento < CURRENT_DATE
              ), 0))
            )
            FROM detalles
          ) AS cumplimientoAcciones,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT estado AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY estado
            ) t
          ) AS estadoRiesgos,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT COALESCE(funcion, 'Sin función') AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY COALESCE(funcion, 'Sin función')
              ORDER BY COUNT(*) DESC
              LIMIT 10
            ) t
          ) AS topFunciones,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.probabilidad, t.consecuencia), '[]'::json)
            FROM (
              SELECT probabilidad, consecuencia, COUNT(*)::int AS value
              FROM detalles
              GROUP BY probabilidad, consecuencia
            ) t
          ) AS heatmapProbabilidadConsecuencia,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT COALESCE(NULLIF(TRIM(responsable), ''), 'Sin responsable') AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY COALESCE(NULLIF(TRIM(responsable), ''), 'Sin responsable')
            ) t
          ) AS riesgosPorResponsable,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT COALESCE(NULLIF(TRIM(recursos), ''), 'Sin recurso') AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY COALESCE(NULLIF(TRIM(recursos), ''), 'Sin recurso')
            ) t
          ) AS recursosMasUsados,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT COALESCE(ubicacion, 'Sin ubicación') AS name, COUNT(*)::int AS value
              FROM detalles
              GROUP BY COALESCE(ubicacion, 'Sin ubicación')
            ) t
          ) AS riesgosPorUbicacion,
          (
            SELECT COALESCE(json_agg(t ORDER BY t.value DESC), '[]'::json)
            FROM (
              SELECT departamento AS name, ROUND(AVG(nivel)::numeric, 2) AS value
              FROM detalles
              GROUP BY departamento
            ) t
          ) AS nivelPromedioPorDepartamento,
          (
            SELECT json_build_object(
              'subDireccion', COALESCE(json_agg(DISTINCT sub_direccion) FILTER (WHERE sub_direccion IS NOT NULL), '[]'::json),
              'departamento', COALESCE(json_agg(DISTINCT departamento) FILTER (WHERE departamento IS NOT NULL), '[]'::json),
              'clasificacion', COALESCE(json_agg(DISTINCT clasificacion) FILTER (WHERE clasificacion IS NOT NULL), '[]'::json),
              'estado', COALESCE(json_agg(DISTINCT estado) FILTER (WHERE estado IS NOT NULL), '[]'::json),
              'responsable', COALESCE(json_agg(DISTINCT responsable) FILTER (WHERE responsable IS NOT NULL AND responsable <> ''), '[]'::json)
            )
            FROM detalles
          ) AS filterOptions
      `,
      params
    )

    const row = result.rows[0] || {}
    return {
      kpis: row.kpis || {},
      charts: {
        distribucionClasificacion: row.distribucionclasificacion || [],
        riesgosPorDepartamento: row.riesgospordepartamento || [],
        riesgosPorTipo: row.riesgosportipo || [],
        riesgosPorSubdireccion: row.riesgosporsubdireccion || [],
        evolucionMensual: row.evolucionmensual || [],
        riesgosPorPuesto: row.riesgosporpuesto || [],
        cumplimientoAcciones: row.cumplimientoacciones || [],
        estadoRiesgos: row.estadoriesgos || [],
        topFunciones: row.topfunciones || [],
        heatmapProbabilidadConsecuencia: row.heatmapprobabilidadconsecuencia || [],
        riesgosPorResponsable: row.riesgosporresponsable || [],
        recursosMasUsados: row.recursosmasusados || [],
        riesgosPorUbicacion: row.riesgosporubicacion || [],
        nivelPromedioPorDepartamento: row.nivelpromediopordepartamento || [],
      },
      filterOptions: row.filteroptions || {
        subDireccion: [],
        departamento: [],
        clasificacion: [],
        estado: [],
        responsable: [],
      },
    }
  },
}
