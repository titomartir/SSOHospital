import { matrizModel } from '../models/matrizModel.js'

export const matrizController = {
  async getAll(req, res) {
    try {
      const data = await matrizModel.getAll()
      res.json(data)
    } catch (err) {
      console.error('matrizController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener la matriz de riesgos' })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const item = await matrizModel.getById(Number(id))
      if (!item) return res.status(404).json({ error: 'Evaluación no encontrada' })
      res.json(item)
    } catch (err) {
      console.error('matrizController.getById:', err)
      res.status(500).json({ error: 'Error al obtener evaluación' })
    }
  },

  async create(req, res) {
    try {
      const newItem = await matrizModel.create(req.body)
      res.status(201).json(newItem)
    } catch (err) {
      console.error('matrizController.create:', err)
      const message = err.code === 'VALIDATION_ERROR' ? err.message : 'Error al crear evaluación de riesgo'
      res.status(err.code === 'VALIDATION_ERROR' ? 400 : 500).json({ error: message })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const updated = await matrizModel.update(Number(id), req.body)
      if (!updated) return res.status(404).json({ error: 'Evaluación no encontrada' })
      res.json(updated)
    } catch (err) {
      console.error('matrizController.update:', err)
      const message = err.code === 'VALIDATION_ERROR' ? err.message : 'Error al actualizar evaluación de riesgo'
      res.status(err.code === 'VALIDATION_ERROR' ? 400 : 500).json({ error: message })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      await matrizModel.remove(Number(id))
      res.json({ message: 'Evaluación eliminada' })
    } catch (err) {
      console.error('matrizController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar evaluación de riesgo' })
    }
  },
}
