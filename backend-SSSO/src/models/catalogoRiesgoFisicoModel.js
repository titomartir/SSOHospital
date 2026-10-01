import pool from '../db/connection.js'

export const catalogoRiesgoFisicoModel = {
  async getPeligroById(peligroId) {
    const result = await pool.query(
      'SELECT id, nombre FROM peligros WHERE id = $1',
      [peligroId]
    )
    return result.rows[0] || null
  },

  async getMedidasByPeligroId(peligroId) {
    const result = await pool.query(
      `SELECT
         pm.id AS "peligroMedidaId",
         mp.id AS "medidaPreventivaId",
         mp.nombre
       FROM peligro_medidas pm
       INNER JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
       WHERE pm.peligro_id = $1
       ORDER BY mp.nombre ASC`,
      [peligroId]
    )

    return result.rows
  },

  async getPeligroMedidaById(peligroMedidaId) {
    const result = await pool.query(
      `SELECT
         pm.id AS "peligroMedidaId",
         p.id AS "peligroId",
         p.nombre AS "peligroNombre",
         mp.id AS "medidaPreventivaId",
         mp.nombre AS "medidaNombre"
       FROM peligro_medidas pm
       INNER JOIN peligros p ON p.id = pm.peligro_id
       INNER JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
       WHERE pm.id = $1`,
      [peligroMedidaId]
    )

    return result.rows[0] || null
  },

  async getAccionesByPeligroMedidaId(peligroMedidaId) {
    const result = await pool.query(
      `SELECT
         pma.id AS "peligroMedidaAccionId",
         a.id AS "accionId",
         a.nombre
       FROM peligro_medida_acciones pma
       INNER JOIN acciones a ON a.id = pma.accion_id
       WHERE pma.peligro_medida_id = $1
       ORDER BY a.nombre ASC`,
      [peligroMedidaId]
    )

    return result.rows
  },

  async getAccionContextoById(peligroMedidaAccionId) {
    const result = await pool.query(
      `SELECT
         p.id AS "peligroId",
         p.nombre AS "peligroNombre",
         pm.id AS "peligroMedidaId",
         mp.id AS "medidaPreventivaId",
         mp.nombre AS "medidaNombre",
         pma.id AS "peligroMedidaAccionId",
         a.id AS "accionId",
         a.nombre AS "accionNombre"
       FROM peligro_medida_acciones pma
       INNER JOIN peligro_medidas pm ON pm.id = pma.peligro_medida_id
       INNER JOIN peligros p ON p.id = pm.peligro_id
       INNER JOIN medidas_preventivas mp ON mp.id = pm.medida_preventiva_id
       INNER JOIN acciones a ON a.id = pma.accion_id
       WHERE pma.id = $1`,
      [peligroMedidaAccionId]
    )

    return result.rows[0] || null
  },

  async getRecursosByAccionContextoId(peligroMedidaAccionId) {
    const result = await pool.query(
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
  },

  async getResponsablesByAccionContextoId(peligroMedidaAccionId) {
    const result = await pool.query(
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

    return result.rows
  },
}
