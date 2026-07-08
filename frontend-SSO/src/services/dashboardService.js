import api from './api.js'

export const dashboardService = {
  async getOverview(filters = {}) {
    const params = {}

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        params[key] = value
      }
    })

    const res = await api.get('/dashboard/overview', { params })
    return res.data
  },
}
