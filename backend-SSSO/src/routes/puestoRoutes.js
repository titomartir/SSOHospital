import { Router } from 'express'
import { puestoController } from '../controllers/puestoController.js'

const router = Router()

router.get('/', puestoController.getAll)
router.post('/', puestoController.create)
router.put('/:id', puestoController.update)
router.delete('/:id', puestoController.remove)

export default router
