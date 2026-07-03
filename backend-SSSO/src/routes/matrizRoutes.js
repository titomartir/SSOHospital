import { Router } from 'express'
import { matrizController } from '../controllers/matrizController.js'

const router = Router()

router.get('/', matrizController.getAll)
router.get('/:id', matrizController.getById)
router.post('/', matrizController.create)
router.put('/:id', matrizController.update)
router.delete('/:id', matrizController.remove)

export default router
