import { recursoModel } from '../models/recursoModel.js'

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

export const recursoController = {
  async getAll(req, res) {
    try {
      const items = await recursoModel.getAll()
      res.json({ items })
    } catch (err) {
      console.error('recursoController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener recursos' })
    }
  },

  async create(req, res) {
    try {
      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const item = await recursoModel.create(nombre)
      res.status(201).json(item)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un recurso con ese nombre' })
      }
      console.error('recursoController.create:', err)
      res.status(500).json({ error: 'Error al crear recurso' })
    }
  },

  async update(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const updated = await recursoModel.update(id, nombre)
      if (!updated) return res.status(404).json({ error: 'Recurso no encontrado' })
      res.json(updated)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un recurso con ese nombre' })
      }
      console.error('recursoController.update:', err)
      res.status(500).json({ error: 'Error al actualizar recurso' })
    }
  },

  async remove(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const removed = await recursoModel.remove(id)
      if (!removed) return res.status(404).json({ error: 'Recurso no encontrado' })
      res.json({ message: 'Recurso eliminado' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: el recurso está en uso' })
      }
      console.error('recursoController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar recurso' })
    }
  },
}
