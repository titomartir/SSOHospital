import { Router } from 'express'
import { responsableController } from '../controllers/responsableController.js'

const router = Router()

router.get('/', responsableController.getAll)
router.post('/', responsableController.create)
router.put('/:id', responsableController.update)
router.delete('/:id', responsableController.remove)

export default router
