import { servicioModel } from '../models/servicioModel.js'

export const servicioController = {
  async getByDepartamento(req, res) {
    try {
      const { departamentoId } = req.query
      if (!departamentoId) return res.status(400).json({ error: 'departamentoId es requerido' })
      const servicios = await servicioModel.getByDepartamento(Number(departamentoId))
      res.json({ servicios })
    } catch (err) {
      console.error('servicioController.getByDepartamento:', err)
      res.status(500).json({ error: 'Error al obtener servicios' })
    }
  },

  async create(req, res) {
    try {
      const { nombre, departamentoId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!departamentoId) return res.status(400).json({ error: 'departamentoId es requerido' })
      const servicio = await servicioModel.create(nombre.trim(), Number(departamentoId))
      res.status(201).json(servicio)
    } catch (err) {
      console.error('servicioController.create:', err)
      res.status(500).json({ error: 'Error al crear servicio' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre, departamentoId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!departamentoId) return res.status(400).json({ error: 'departamentoId es requerido' })
      const updated = await servicioModel.update(Number(id), {
        nombre: nombre.trim(),
        departamentoId: Number(departamentoId),
      })
      if (!updated) return res.status(404).json({ error: 'Servicio no encontrado' })
      res.json(updated)
    } catch (err) {
      console.error('servicioController.update:', err)
      res.status(500).json({ error: 'Error al actualizar servicio' })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      await servicioModel.remove(Number(id))
      res.json({ message: 'Servicio eliminado' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: el servicio está en uso' })
      }
      console.error('servicioController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar servicio' })
    }
  },
}
