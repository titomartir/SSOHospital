import { Router } from 'express'
import { funcionController } from '../controllers/funcionController.js'

const router = Router()

router.get('/', funcionController.getByPuesto)
router.post('/', funcionController.create)
router.put('/:id', funcionController.update)
router.delete('/:id', funcionController.remove)

export default router
