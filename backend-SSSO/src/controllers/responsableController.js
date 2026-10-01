import { responsableModel } from '../models/responsableModel.js'

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

export const responsableController = {
  async getAll(req, res) {
    try {
      const items = await responsableModel.getAll()
      res.json({ items })
    } catch (err) {
      console.error('responsableController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener responsables' })
    }
  },

  async create(req, res) {
    try {
      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const item = await responsableModel.create(nombre)
      res.status(201).json(item)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un responsable con ese nombre' })
      }
      console.error('responsableController.create:', err)
      res.status(500).json({ error: 'Error al crear responsable' })
    }
  },

  async update(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const nombre = normalizeNombre(req.body?.nombre)
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' })
      if (nombre === '__TOO_LONG__') return res.status(400).json({ error: 'El nombre no puede exceder 255 caracteres' })

      const updated = await responsableModel.update(id, nombre)
      if (!updated) return res.status(404).json({ error: 'Responsable no encontrado' })
      res.json(updated)
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un responsable con ese nombre' })
      }
      console.error('responsableController.update:', err)
      res.status(500).json({ error: 'Error al actualizar responsable' })
    }
  },

  async remove(req, res) {
    try {
      const id = parseId(req.params?.id)
      if (!id) return res.status(400).json({ error: 'ID inválido' })

      const removed = await responsableModel.remove(id)
      if (!removed) return res.status(404).json({ error: 'Responsable no encontrado' })
      res.json({ message: 'Responsable eliminado' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: el responsable está en uso' })
      }
      console.error('responsableController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar responsable' })
    }
  },
}
