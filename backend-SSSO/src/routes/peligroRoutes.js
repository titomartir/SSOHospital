import { Router } from 'express'
import { peligroController } from '../controllers/peligroController.js'

const router = Router()

router.get('/', peligroController.getAll)
router.post('/', peligroController.create)
router.put('/:id', peligroController.update)
router.delete('/id/:id', peligroController.removeById)
router.delete('/:nombre', peligroController.remove)

export default router
