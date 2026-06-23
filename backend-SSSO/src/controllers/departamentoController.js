import { departamentoModel } from '../models/departamentoModel.js'

export const departamentoController = {
  async getAll(req, res) {
    try {
      const detailed = await departamentoModel.getAllDetailed()
      const departamentos = detailed.map((d) => d.nombre)
      res.json({ departamentos, items: detailed })
    } catch (err) {
      console.error('departamentoController.getAll:', err)
      res.status(500).json({ error: 'Error al obtener departamentos' })
    }
  },

  async create(req, res) {
    try {
      const { nombre, subDireccionId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!subDireccionId) return res.status(400).json({ error: 'subDireccionId es requerido' })
      const departamento = await departamentoModel.create(nombre.trim(), Number(subDireccionId))
      res.status(201).json(departamento)
    } catch (err) {
      console.error('departamentoController.create:', err)
      res.status(500).json({ error: 'Error al crear departamento' })
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params
      const { nombre, subDireccionId } = req.body
      if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es requerido' })
      if (!subDireccionId) return res.status(400).json({ error: 'subDireccionId es requerido' })
      const updated = await departamentoModel.update(Number(id), {
        nombre: nombre.trim(),
        subDireccionId: Number(subDireccionId),
      })
      if (!updated) return res.status(404).json({ error: 'Departamento no encontrado' })
      res.json(updated)
    } catch (err) {
      console.error('departamentoController.update:', err)
      res.status(500).json({ error: 'Error al actualizar departamento' })
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

  async removeById(req, res) {
    try {
      const { id } = req.params
      await departamentoModel.removeById(Number(id))
      res.json({ message: 'Departamento eliminado' })
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar: hay servicios o evaluaciones asociadas' })
      }
      console.error('departamentoController.removeById:', err)
      res.status(500).json({ error: 'Error al eliminar departamento' })
    }
  },
}
