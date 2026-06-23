import { Router } from 'express'
import { departamentoController } from '../controllers/departamentoController.js'

const router = Router()

router.get('/', departamentoController.getAll)
router.post('/', departamentoController.create)
router.put('/:id', departamentoController.update)
router.delete('/id/:id', departamentoController.removeById)
router.delete('/:nombre', departamentoController.remove)

export default router
