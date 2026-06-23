import { Router } from 'express'
import { catalogoEstructuraController } from '../controllers/catalogoEstructuraController.js'

const router = Router()

router.get('/', catalogoEstructuraController.getTree)

export default router
