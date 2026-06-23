import { catalogoEstructuraModel } from '../models/catalogoEstructuraModel.js'

export const catalogoEstructuraController = {
  async getTree(req, res) {
    try {
      const estructura = await catalogoEstructuraModel.getTree()
      res.json({ estructura })
    } catch (err) {
      console.error('catalogoEstructuraController.getTree:', err)
      res.status(500).json({ error: 'Error al obtener estructura organizacional' })
    }
  },
}
