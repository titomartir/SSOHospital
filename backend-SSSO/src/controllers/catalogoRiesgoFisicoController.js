import { catalogoRiesgoFisicoModel } from '../models/catalogoRiesgoFisicoModel.js'

function parsePositiveInt(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    const error = new Error(`${fieldName} invalido`)
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${fieldName} invalido`)
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  return parsed
}

export const catalogoRiesgoFisicoController = {
  async getMedidasByPeligro(req, res) {
    try {
      const peligroId = parsePositiveInt(req.params.peligroId, 'peligroId')

      const peligro = await catalogoRiesgoFisicoModel.getPeligroById(peligroId)
      if (!peligro) {
        const error = new Error('Peligro no encontrado')
        error.code = 'NOT_FOUND'
        throw error
      }

      const medidas = await catalogoRiesgoFisicoModel.getMedidasByPeligroId(peligroId)

      return res.json({
        peligro: {
          id: peligro.id,
          nombre: peligro.nombre,
        },
        medidas,
      })
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: err.message })
      }

      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({ error: err.message })
      }

      console.error('catalogoRiesgoFisicoController.getMedidasByPeligro:', err)
      return res.status(500).json({ error: 'Error al obtener medidas por peligro' })
    }
  },

  async getAccionesByPeligroMedida(req, res) {
    try {
      const peligroMedidaId = parsePositiveInt(req.params.peligroMedidaId, 'peligroMedidaId')

      const peligroMedida = await catalogoRiesgoFisicoModel.getPeligroMedidaById(peligroMedidaId)
      if (!peligroMedida) {
        const error = new Error('Relacion peligro-medida no encontrada')
        error.code = 'NOT_FOUND'
        throw error
      }

      const acciones = await catalogoRiesgoFisicoModel.getAccionesByPeligroMedidaId(peligroMedidaId)

      return res.json({
        peligro: {
          id: peligroMedida.peligroId,
          nombre: peligroMedida.peligroNombre,
        },
        medida: {
          peligroMedidaId: peligroMedida.peligroMedidaId,
          medidaPreventivaId: peligroMedida.medidaPreventivaId,
          nombre: peligroMedida.medidaNombre,
        },
        acciones,
      })
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: err.message })
      }

      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({ error: err.message })
      }

      console.error('catalogoRiesgoFisicoController.getAccionesByPeligroMedida:', err)
      return res.status(500).json({ error: 'Error al obtener acciones por peligro-medida' })
    }
  },

  async getConfiguracionByAccion(req, res) {
    try {
      const peligroMedidaAccionId = parsePositiveInt(req.params.peligroMedidaAccionId, 'peligroMedidaAccionId')

      const accionContexto = await catalogoRiesgoFisicoModel.getAccionContextoById(peligroMedidaAccionId)
      if (!accionContexto) {
        const error = new Error('Accion contextual no encontrada')
        error.code = 'NOT_FOUND'
        throw error
      }

      const recursos = await catalogoRiesgoFisicoModel.getRecursosByAccionContextoId(peligroMedidaAccionId)
      const responsables = await catalogoRiesgoFisicoModel.getResponsablesByAccionContextoId(peligroMedidaAccionId)

      const principales = responsables.filter((r) => r.tipo === 'PRINCIPAL')
      if (principales.length !== 1) {
        const error = new Error('Configuracion inconsistente: la accion contextual debe tener exactamente un responsable PRINCIPAL')
        error.code = 'CONFIGURATION_ERROR'
        throw error
      }

      const responsablePrincipal = {
        id: principales[0].id,
        nombre: principales[0].nombre,
      }

      const responsablesApoyo = responsables
        .filter((r) => r.tipo === 'APOYO')
        .map((r) => ({ id: r.id, nombre: r.nombre }))

      return res.json({
        peligro: {
          id: accionContexto.peligroId,
          nombre: accionContexto.peligroNombre,
        },
        medida: {
          peligroMedidaId: accionContexto.peligroMedidaId,
          medidaPreventivaId: accionContexto.medidaPreventivaId,
          nombre: accionContexto.medidaNombre,
        },
        accion: {
          peligroMedidaAccionId: accionContexto.peligroMedidaAccionId,
          accionId: accionContexto.accionId,
          nombre: accionContexto.accionNombre,
        },
        recursos,
        responsablePrincipal,
        responsablesApoyo,
      })
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: err.message })
      }

      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({ error: err.message })
      }

      if (err.code === 'CONFIGURATION_ERROR') {
        console.error('catalogoRiesgoFisicoController.getConfiguracionByAccion:', err.message)
        return res.status(500).json({ error: err.message })
      }

      console.error('catalogoRiesgoFisicoController.getConfiguracionByAccion:', err)
      return res.status(500).json({ error: 'Error al obtener configuracion contextual de la accion' })
    }
  },
}
