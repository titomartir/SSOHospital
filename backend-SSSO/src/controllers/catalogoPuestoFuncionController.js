import { catalogoPuestoFuncionModel } from '../models/catalogoPuestoFuncionModel.js'

export const catalogoPuestoFuncionController = {
  async getTree(req, res) {
    try {
      const estructura = await catalogoPuestoFuncionModel.getTree()
      res.json({ estructura })
    } catch (err) {
      console.error('catalogoPuestoFuncionController.getTree:', err)
      res.status(500).json({ error: 'Error al obtener estructura de puestos y funciones' })
    }
  },
}
