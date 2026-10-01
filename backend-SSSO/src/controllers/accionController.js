import { accionModel } from '../models/accionModel.js'

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

export const accionController = {
  async getAll(req, res) {
    try {
      const items = await accionModel.getAll()
      res.json({ items })
    } catch (err) {
      console.error('accionController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener acciones' })
    }
  },

  async create(req, res) {
    try {
      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const item = await accionModel.create(nombre)
      res.status(201).json(item)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe una acción con ese nombre' })
      }
      console.error('accionController.create:', err)
      res.status(500).json({ error: 'Error al crear acción' })
    }
  },

  async update(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const updated = await accionModel.update(id, nombre)
      if (!updated) return res.status(404).json({ error: 'Acción no encontrada' })
      res.json(updated)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe una acción con ese nombre' })
      }
      console.error('accionController.update:', err)
      res.status(500).json({ error: 'Error al actualizar acción' })
    }
  },

  async remove(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const removed = await accionModel.remove(id)
      if (!removed) return res.status(404).json({ error: 'Acción no encontrada' })
      res.json({ message: 'Acción eliminada' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: la acción está en uso' })
      }
      console.error('accionController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar acción' })
    }
  },
}
