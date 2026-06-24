import { puestoModel } from '../models/puestoModel.js'

export const puestoController = {
  async getAll(req, res) {
    try {
      const items = await puestoModel.getAll()
      const puestos = items.map((p) => p.nombre)
      res.json({ puestos, items })
    } catch (err) {
      console.error('puestoController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener puestos' })
    }
  },

  async create(req, res) {
    try {
      const { nombre, servicioId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!servicioId) return res.status(400).json({ error: 'servicioId es requerido' })
      const puesto = await puestoModel.create(nombre.trim(), Number(servicioId))
      res.status(201).json(puesto)
    } catch (err) {
      console.error('puestoController.create:', err)
      res.status(500).json({ error: 'Error al crear puesto' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre, servicioId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!servicioId) return res.status(400).json({ error: 'servicioId es requerido' })
      const updated = await puestoModel.update(Number(id), nombre.trim(), Number(servicioId))
      if (!updated) return res.status(404).json({ error: 'Puesto no encontrado' })
      res.json(updated)
    } catch (err) {
      console.error('puestoController.update:', err)
      res.status(500).json({ error: 'Error al actualizar puesto' })
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params
      await puestoModel.remove(Number(id))
      res.json({ message: 'Puesto eliminado' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: hay funciones asociadas' })
      }
      console.error('puestoController.remove:', err)
      res.status(500).json({ error: 'Error al eliminar puesto' })
    }
  },
}
