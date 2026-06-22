import { planificacionModel } from '../models/planificacionModel.js'

export const planificacionController = {
  async getAll(req, res) {
    try {
      const data = await planificacionModel.getAll()
      res.json(data)
    } catch (err) {
      console.error('planificacionController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener planificaciones' })
    }
  },

  async create(req, res) {
    try {
      const newItem = await planificacionModel.create(req.body)
      res.status(201).json(newItem)
    } catch (err) {
      console.error('planificacionController.create:', err)
      res.status(500).json({ error: 'Error al crear planificación' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await planificacionModel.update(Number(id), req.body)
      if (!updated) return res.status(404).json({ error: 'Planificación no encontrada' })
      res.json(updated)
    } catch (err) {
      console.error('planificacionController.update:', err)
      res.status(500).json({ error: 'Error al actualizar planificación' })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      await planificacionModel.remove(Number(id))
      res.json({ message: 'Planificación eliminada' })
    } catch (err) {
      console.error('planificacionController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar planificación' })
    }
  },
}
