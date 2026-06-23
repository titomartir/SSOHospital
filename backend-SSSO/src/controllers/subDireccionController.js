import { subDireccionModel } from '../models/subDireccionModel.js'

export const subDireccionController = {
  async getAll(req, res) {
    try {
      const subDirecciones = await subDireccionModel.getAll()
      res.json({ subDirecciones })
    } catch (err) {
      console.error('subDireccionController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener sub direcciones' })
    }
  },

  async create(req, res) {
    try {
      const { nombre } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      const subDireccion = await subDireccionModel.create(nombre.trim())
      res.status(201).json(subDireccion)
    } catch (err) {
      console.error('subDireccionController.create:', err)
      res.status(500).json({ error: 'Error al crear sub dirección' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      const updated = await subDireccionModel.update(Number(id), nombre.trim())
      if (!updated) return res.status(404).json({ error: 'Sub dirección no encontrada' })
      res.json(updated)
    } catch (err) {
      console.error('subDireccionController.update:', err)
      res.status(500).json({ error: 'Error al actualizar sub dirección' })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      await subDireccionModel.remove(Number(id))
      res.json({ message: 'Sub dirección eliminada' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: hay departamentos asociados' })
      }
      console.error('subDireccionController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar sub dirección' })
    }
  },
}
