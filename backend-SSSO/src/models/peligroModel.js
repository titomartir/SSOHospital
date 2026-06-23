import pool from '../db/connection.js'

export const peligroModel = {
  async getAll(riesgoId = null) {
    const result = riesgoId
      ? await pool.query(
        'SELECT nombre FROM peligros WHERE riesgo_id = $1 ORDER BY nombre ASC',
        [riesgoId]
      )
      : await pool.query('SELECT nombre FROM peligros ORDER BY nombre ASC')
    return result.rows.map((r) => r.nombre)
  },

  async getAllDetailed(riesgoId = null) {
    const result = riesgoId
      ? await pool.query(
        `SELECT id, nombre, riesgo_id AS "riesgoId",
                created_at AS "createdAt", updated_at AS "updatedAt"
         FROM peligros
         WHERE riesgo_id = $1
         ORDER BY nombre ASC`,
        [riesgoId]
      )
      : await pool.query(
        `SELECT id, nombre, riesgo_id AS "riesgoId",
                created_at AS "createdAt", updated_at AS "updatedAt"
         FROM peligros
         ORDER BY nombre ASC`
      )
    return result.rows
  },

  async create(nombre, riesgoId) {
    const result = await pool.query(
      `INSERT INTO peligros (nombre, riesgo_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, nombre, riesgo_id AS "riesgoId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, riesgoId]
    )
    return result.rows[0]
  },

  async update(id, payload) {
    const { nombre, riesgoId } = payload
    const result = await pool.query(
      `UPDATE peligros
       SET nombre = $1,
           riesgo_id = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, nombre, riesgo_id AS "riesgoId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [nombre, riesgoId, id]
    )
    return result.rows[0] || null
  },

  async removeById(id) {
    const peligroResult = await pool.query('SELECT nombre FROM peligros WHERE id = $1', [id])
    if (peligroResult.rowCount === 0) return true

    const [peligro] = peligroResult.rows
    const inUseResult = await pool.query(
      'SELECT 1 FROM matriz_riesgos WHERE peligro = $1 LIMIT 1',
      [peligro.nombre]
    )

    if (inUseResult.rowCount > 0) {
      const error = new Error('Peligro en uso')
      error.code = 'PeligroEnUso'
      throw error
    }

    await pool.query('DELETE FROM peligros WHERE id = $1', [id])
    return true
  },

  async remove(nombre) {
    const inUseResult = await pool.query(
      'SELECT 1 FROM matriz_riesgos WHERE peligro = $1 LIMIT 1',
      [nombre]
    )

    if (inUseResult.rowCount > 0) {
      const error = new Error('Peligro en uso')
      error.code = 'PeligroEnUso'
      throw error
    }

    await pool.query('DELETE FROM peligros WHERE nombre = $1', [nombre])
    return this.getAll()
  },
}
