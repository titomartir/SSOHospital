import { medidaPreventivaModel } from '../models/medidaPreventivaModel.js'

const MAX_NOMBRE_LENGTH = 255

const parseId = (value) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const normalizeNombre = (value) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > MAX_NOMBRE_LENGTH) return '__TOO_LONG__'
  return trimmed
}

export const medidaPreventivaController = {
  async getAll(req, res) {
    try {
      const items = await medidaPreventivaModel.getAll()
      res.json({ items })
    } catch (err) {
      console.error('medidaPreventivaController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener medidas preventivas' })
    }
  },

  async create(req, res) {
    try {
      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const item = await medidaPreventivaModel.create(nombre)
      res.status(201).json(item)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe una medida preventiva con ese nombre' })
      }
      console.error('medidaPreventivaController.create:', err)
      res.status(500).json({ error: 'Error al crear medida preventiva' })
    }
  },

  async update(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const updated = await medidaPreventivaModel.update(id, nombre)
      if (!updated) return res.status(404).json({ error: 'Medida preventiva no encontrada' })
      res.json(updated)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe una medida preventiva con ese nombre' })
      }
      console.error('medidaPreventivaController.update:', err)
      res.status(500).json({ error: 'Error al actualizar medida preventiva' })
    }
  },

  async remove(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const removed = await medidaPreventivaModel.remove(id)
      if (!removed) return res.status(404).json({ error: 'Medida preventiva no encontrada' })
      res.json({ message: 'Medida preventiva eliminada' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: la medida preventiva está en uso' })
      }
      console.error('medidaPreventivaController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar medida preventiva' })
    }
  },
}
