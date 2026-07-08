import api from './api.js'

export const planificacionService = {
  async getAll() {
    const res = await api.get('/planificacion')
    return res.data
  },

  async create(payload) {
    const res = await api.post('/planificacion', payload)
    return res.data
  },

  async update(id, payload) {
    const res = await api.put(`/planificacion/${id}`, payload)
    return res.data
  },

  async remove(id) {
    await api.delete(`/planificacion/${id}`)
    return true
  },
}
