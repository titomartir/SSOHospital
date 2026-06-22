import { Router } from 'express'
import { planificacionController } from '../controllers/planificacionController.js'

const router = Router()

router.get('/', planificacionController.getAll)
router.post('/', planificacionController.create)
router.put('/:id', planificacionController.update)
router.delete('/:id', planificacionController.remove)

export default router
