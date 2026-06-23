import { Router } from 'express'
import { riesgoController } from '../controllers/riesgoController.js'

const router = Router()

router.get('/', riesgoController.getAll)
router.post('/', riesgoController.create)
router.put('/:id', riesgoController.update)
router.delete('/id/:id', riesgoController.removeById)
router.delete('/:nombre', riesgoController.remove)

export default router
