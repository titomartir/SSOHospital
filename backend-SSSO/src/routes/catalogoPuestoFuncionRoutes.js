import { Router } from 'express'
import { catalogoPuestoFuncionController } from '../controllers/catalogoPuestoFuncionController.js'

const router = Router()

router.get('/', catalogoPuestoFuncionController.getTree)

export default router
