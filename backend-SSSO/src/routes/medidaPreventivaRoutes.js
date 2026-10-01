import { Router } from 'express'
import { medidaPreventivaController } from '../controllers/medidaPreventivaController.js'

const router = Router()

router.get('/', medidaPreventivaController.getAll)
router.post('/', medidaPreventivaController.create)
router.put('/:id', medidaPreventivaController.update)
router.delete('/:id', medidaPreventivaController.remove)

export default router
