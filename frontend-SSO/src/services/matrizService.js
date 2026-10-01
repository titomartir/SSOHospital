import api from './api.js'

export const matrizService = {
  async getAll() {
    const res = await api.get('/matriz')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/matriz/${id}`)
    return res.data
  },

  async create(payload) {
    const res = await api.post('/matriz', payload)
    return res.data
  },

  async update(id, payload) {
    const res = await api.put(`/matriz/${id}`, payload)
    return res.data
  },

  async remove(id) {
    await api.delete(`/matriz/${id}`)
    return true
  },

  async getMedidasByPeligro(peligroId) {
    const res = await api.get(
      `/catalogo-riesgo-fisico/peligros/${peligroId}/medidas`
    )
    return res.data
  },

  async getAccionesByPeligroMedida(peligroMedidaId) {
    const res = await api.get(
      `/catalogo-riesgo-fisico/peligro-medidas/${peligroMedidaId}/acciones`
    )
    return res.data
  },

  async getConfiguracionByAccion(peligroMedidaAccionId) {
    const res = await api.get(
      `/catalogo-riesgo-fisico/acciones/${peligroMedidaAccionId}/configuracion`
    )
    return res.data
  },
}
