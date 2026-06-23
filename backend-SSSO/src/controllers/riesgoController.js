import { riesgoModel } from '../models/riesgoModel.js'

export const riesgoController = {
  async getAll(req, res) {
    try {
      const items = await riesgoModel.getAllDetailed()
      const riesgos = items.map((r) => r.nombre)
      res.json({ riesgos, items })
    } catch (err) {
      console.error('riesgoController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener riesgos' })
    }
  },

  async create(req, res) {
    try {
      const { nombre } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      const riesgo = await riesgoModel.create(nombre.trim())
      res.status(201).json(riesgo)
    } catch (err) {
      console.error('riesgoController.create:', err)
      res.status(500).json({ error: 'Error al crear riesgo' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      const updated = await riesgoModel.update(Number(id), nombre.trim())
      if (!updated) return res.status(404).json({ error: 'Riesgo no encontrado' })
      res.json(updated)
    } catch (err) {
      console.error('riesgoController.update:', err)
      res.status(500).json({ error: 'Error al actualizar riesgo' })
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

  async removeById(req, res) {
    try {
      const { id } = req.params
      await riesgoModel.removeById(Number(id))
      res.json({ message: 'Riesgo eliminado' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: hay peligros asociados o está en uso' })
      }
      console.error('riesgoController.removeById:', err)
      res.status(500).json({ error: 'Error al eliminar riesgo' })
    }
  },
}
