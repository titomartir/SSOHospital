import { Router } from 'express'
import { recursoController } from '../controllers/recursoController.js'

const router = Router()

router.get('/', recursoController.getAll)
router.post('/', recursoController.create)
router.put('/:id', recursoController.update)
router.delete('/:id', recursoController.remove)

export default router
