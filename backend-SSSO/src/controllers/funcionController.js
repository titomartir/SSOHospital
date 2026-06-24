import { funcionModel } from '../models/funcionModel.js'

export const funcionController = {
  async getByPuesto(req, res) {
    try {
      const { puestoId } = req.query
      if (!puestoId) return res.status(400).json({ error: 'puestoId es requerido' })
      const funciones = await funcionModel.getByPuesto(Number(puestoId))
      res.json({ funciones })
    } catch (err) {
      console.error('funcionController.getByPuesto:', err)
      res.status(500).json({ error: 'Error al obtener funciones' })
    }
  },

  async create(req, res) {
    try {
      const { nombre, puestoId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!puestoId) return res.status(400).json({ error: 'puestoId es requerido' })
      const funcion = await funcionModel.create(nombre.trim(), Number(puestoId))
      res.status(201).json(funcion)
    } catch (err) {
      console.error('funcionController.create:', err)
      res.status(500).json({ error: 'Error al crear función' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre, puestoId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!puestoId) return res.status(400).json({ error: 'puestoId es requerido' })
      const updated = await funcionModel.update(Number(id), {
        nombre: nombre.trim(),
        puestoId: Number(puestoId),
      })
      if (!updated) return res.status(404).json({ error: 'Función no encontrada' })
      res.json(updated)
    } catch (err) {
      console.error('funcionController.update:', err)
      res.status(500).json({ error: 'Error al actualizar función' })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      await funcionModel.remove(Number(id))
      res.json({ message: 'Función eliminada' })
    } catch (err) {
      console.error('funcionController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar función' })
    }
  },
}
