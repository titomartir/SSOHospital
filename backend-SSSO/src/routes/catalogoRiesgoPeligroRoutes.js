import { Router } from 'express'
import { catalogoRiesgoPeligroController } from '../controllers/catalogoRiesgoPeligroController.js'

const router = Router()

router.get('/', catalogoRiesgoPeligroController.getTree)

export default router
