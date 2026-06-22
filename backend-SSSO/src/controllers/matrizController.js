import { matrizModel } from '../models/matrizModel.js'
import { calculateRiskLevel, classifyRisk } from '../utils/calculators.js'

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

  async create(req, res) {
    try {
      const payload = req.body
      const nivel = calculateRiskLevel(payload.probabilidad, payload.consecuencia)
      const clasificacion = classifyRisk(nivel)
      const newItem = await matrizModel.create({ ...payload, nivel, clasificacion })
      res.status(201).json(newItem)
    } catch (err) {
      console.error('matrizController.create:', err)
      res.status(500).json({ error: 'Error al crear evaluación de riesgo' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const payload = req.body
      const nivel = calculateRiskLevel(payload.probabilidad, payload.consecuencia)
      const clasificacion = classifyRisk(nivel)
      const updated = await matrizModel.update(Number(id), { ...payload, nivel, clasificacion })
      if (!updated) return res.status(404).json({ error: 'Evaluación no encontrada' })
      res.json(updated)
    } catch (err) {
      console.error('matrizController.update:', err)
      res.status(500).json({ error: 'Error al actualizar evaluación de riesgo' })
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
