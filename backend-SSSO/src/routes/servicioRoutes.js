import { Router } from 'express'
import { servicioController } from '../controllers/servicioController.js'

const router = Router()

router.get('/', servicioController.getByDepartamento)
router.post('/', servicioController.create)
router.put('/:id', servicioController.update)
router.delete('/:id', servicioController.remove)

export default router
