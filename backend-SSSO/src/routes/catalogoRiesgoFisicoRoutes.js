import { Router } from 'express'
import { catalogoRiesgoFisicoController } from '../controllers/catalogoRiesgoFisicoController.js'

const router = Router()

router.get(
  '/peligros/:peligroId/medidas',
  catalogoRiesgoFisicoController.getMedidasByPeligro
)

router.get(
  '/peligro-medidas/:peligroMedidaId/acciones',
  catalogoRiesgoFisicoController.getAccionesByPeligroMedida
)

router.get(
  '/acciones/:peligroMedidaAccionId/configuracion',
  catalogoRiesgoFisicoController.getConfiguracionByAccion
)

export default router
