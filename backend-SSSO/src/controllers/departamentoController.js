import { departamentoModel } from '../models/departamentoModel.js'

export const departamentoController = {
  async getAll(req, res) {
    try {
      const departamentos = await departamentoModel.getAll()
      res.json({ departamentos })
    } catch (err) {
      console.error('departamentoController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener departamentos' })
    }
  },

  async create(req, res) {
    try {
      const { nombre } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      const departamentos = await departamentoModel.create(nombre.trim())
      res.status(201).json({ departamentos })
    } catch (err) {
      console.error('departamentoController.create:', err)
      res.status(500).json({ error: 'Error al crear departamento' })
    }
  },

  async remove(req, res) {
    try {
      const { nombre } = req.params
      const departamentos = await departamentoModel.remove(decodeURIComponent(nombre))
      res.json({ departamentos })
    } catch (err) {
      console.error('departamentoController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar departamento' })
    }
  },
}
