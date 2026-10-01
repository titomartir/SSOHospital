import { Router } from 'express'
import { accionController } from '../controllers/accionController.js'

const router = Router()

router.get('/', accionController.getAll)
router.post('/', accionController.create)
router.put('/:id', accionController.update)
router.delete('/:id', accionController.remove)

export default router
