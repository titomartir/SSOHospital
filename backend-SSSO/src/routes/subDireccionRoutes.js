import { Router } from 'express'
import { subDireccionController } from '../controllers/subDireccionController.js'

const router = Router()

router.get('/', subDireccionController.getAll)
router.post('/', subDireccionController.create)
router.put('/:id', subDireccionController.update)
router.delete('/:id', subDireccionController.remove)

export default router
