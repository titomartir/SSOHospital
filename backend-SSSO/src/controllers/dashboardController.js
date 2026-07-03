import { dashboardModel } from '../models/dashboardModel.js'

export const dashboardController = {
  async getOverview(req, res) {
    try {
      const payload = await dashboardModel.getOverview({
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta,
        subDireccion: req.query.subDireccion,
        departamento: req.query.departamento,
        clasificacion: req.query.clasificacion,
        estado: req.query.estado,
        responsable: req.query.responsable,
      })
      res.json(payload)
    } catch (err) {
      console.error('dashboardController.getOverview:', err)
      res.status(500).json({ error: 'Error al obtener datos del dashboard' })
    }
  },
}
