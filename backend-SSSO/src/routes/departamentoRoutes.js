import { Router } from 'express'
import { departamentoController } from '../controllers/departamentoController.js'

const router = Router()

router.get('/', departamentoController.getAll)
router.post('/', departamentoController.create)
router.delete('/:nombre', departamentoController.remove)

export default router
