import { peligroModel } from '../models/peligroModel.js'

export const peligroController = {
  async getAll(req, res) {
    try {
      const { riesgoId } = req.query
      const parsedRiesgoId = riesgoId ? Number(riesgoId) : null
      const items = await peligroModel.getAllDetailed(parsedRiesgoId)
      const peligros = items.map((p) => p.nombre)
      res.json({ peligros, items })
    } catch (err) {
      console.error('peligroController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener peligros' })
    }
  },

  async create(req, res) {
    try {
      const { nombre, riesgoId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!riesgoId) return res.status(400).json({ error: 'riesgoId es requerido' })
      const peligro = await peligroModel.create(nombre.trim(), Number(riesgoId))
      res.status(201).json(peligro)
    } catch (err) {
      console.error('peligroController.create:', err)
      res.status(500).json({ error: 'Error al crear peligro' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre, riesgoId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!riesgoId) return res.status(400).json({ error: 'riesgoId es requerido' })
      const updated = await peligroModel.update(Number(id), {
        nombre: nombre.trim(),
        riesgoId: Number(riesgoId),
      })
      if (!updated) return res.status(404).json({ error: 'Peligro no encontrado' })
      res.json(updated)
    } catch (err) {
      console.error('peligroController.update:', err)
      res.status(500).json({ error: 'Error al actualizar peligro' })
    }
  },

  async remove(req, res) {
    try {
      const { nombre } = req.params
      const peligros = await peligroModel.remove(decodeURIComponent(nombre))
      res.json({ peligros })
    } catch (err) {
      if (err.code === 'PeligroEnUso') {
        return res.status(409).json({ error: 'No se puede eliminar: el peligro está en uso en evaluaciones' })
      }
      console.error('peligroController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar peligro' })
    }
  },

  async removeById(req, res) {
    try {
      const { id } = req.params
      await peligroModel.removeById(Number(id))
      res.json({ message: 'Peligro eliminado' })
    } catch (err) {
      if (err.code === 'PeligroEnUso') {
        return res.status(409).json({ error: 'No se puede eliminar: el peligro está en uso en evaluaciones' })
      }
      console.error('peligroController.removeById:', err)
      res.status(500).json({ error: 'Error al eliminar peligro' })
    }
  },
}
