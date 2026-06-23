import { catalogoRiesgoPeligroModel } from '../models/catalogoRiesgoPeligroModel.js'

export const catalogoRiesgoPeligroController = {
  async getTree(req, res) {
    try {
      const estructura = await catalogoRiesgoPeligroModel.getTree()
      res.json({ estructura })
    } catch (err) {
      console.error('catalogoRiesgoPeligroController.getTree:', err)
      res.status(500).json({ error: 'Error al obtener estructura de riesgos y peligros' })
    }
  },
}
