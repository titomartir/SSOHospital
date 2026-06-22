import { riesgoModel } from '../models/riesgoModel.js'

export const riesgoController = {
  async getAll(req, res) {
    try {
      const riesgos = await riesgoModel.getAll()
      res.json({ riesgos })
    } catch (err) {
      console.error('riesgoController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener riesgos' })
    }
  },

  async create(req, res) {
    try {
      const { nombre } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      const riesgos = await riesgoModel.create(nombre.trim())
      res.status(201).json({ riesgos })
    } catch (err) {
      console.error('riesgoController.create:', err)
      res.status(500).json({ error: 'Error al crear riesgo' })
    }
  },

  async remove(req, res) {
    try {
      const { nombre } = req.params
      const riesgos = await riesgoModel.remove(decodeURIComponent(nombre))
      res.json({ riesgos })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: el riesgo está en uso en evaluaciones' })
      }
      console.error('riesgoController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar riesgo' })
    }
  },
}
