import api from './api.js'

export const catalogoService = {
  async getAll() {
    const [depRes, estructuraRes, riesgoPeligroRes] = await Promise.all([
      api.get('/departamentos'),
      api.get('/catalogo-estructura'),
      api.get('/catalogo-riesgo-peligro'),
    ])
    const riesgoPeligroEstructura = riesgoPeligroRes.data.estructura || []
    const estructura = estructuraRes.data.estructura || []
    return {
      departamentos: depRes.data.departamentos,
      estructura,
      riesgoPeligroEstructura,
      riesgos: riesgoPeligroEstructura.map((r) => r.nombre),
      peligros: riesgoPeligroEstructura.flatMap((r) => r.peligros.map((p) => p.nombre)),
      puestos: estructura.flatMap((sd) =>
        sd.departamentos.flatMap((d) =>
          d.servicios.flatMap((s) => s.puestos.map((p) => p.nombre))
        )
      ),
      funciones: estructura.flatMap((sd) =>
        sd.departamentos.flatMap((d) =>
          d.servicios.flatMap((s) =>
            s.puestos.flatMap((p) => p.funciones.map((f) => f.nombre))
          )
        )
      ),
      escalasProbabilidad: [1, 2, 3, 4, 5],
      escalasConsecuencia: [1, 2, 3, 4, 5],
      clasificaciones: ['Bajo', 'Medio', 'Alto', 'Muy alto'],
    }
  },

  async addDepartamento(nombre) {
    const res = await api.post('/departamentos', { nombre })
    return res.data.departamentos
  },

  async getEstructura() {
    const res = await api.get('/catalogo-estructura')
    return res.data.estructura
  },

  async addSubDireccion(nombre) {
    const res = await api.post('/sub-direcciones', { nombre })
    return res.data
  },

  async updateSubDireccion(id, nombre) {
    const res = await api.put(`/sub-direcciones/${id}`, { nombre })
    return res.data
  },

  async removeSubDireccion(id) {
    await api.delete(`/sub-direcciones/${id}`)
    return true
  },

  async addDepartamentoToSubDireccion(nombre, subDireccionId) {
    const res = await api.post('/departamentos', { nombre, subDireccionId })
    return res.data
  },

  async updateDepartamento(id, nombre, subDireccionId) {
    const res = await api.put(`/departamentos/${id}`, { nombre, subDireccionId })
    return res.data
  },

  async removeDepartamentoById(id) {
    await api.delete(`/departamentos/id/${id}`)
    return true
  },

  async addServicio(nombre, departamentoId) {
    const res = await api.post('/servicios', { nombre, departamentoId })
    return res.data
  },

  async updateServicio(id, nombre, departamentoId) {
    const res = await api.put(`/servicios/${id}`, { nombre, departamentoId })
    return res.data
  },

  async removeServicio(id) {
    await api.delete(`/servicios/${id}`)
    return true
  },

  async removeDepartamento(nombre) {
    const res = await api.delete(`/departamentos/${encodeURIComponent(nombre)}`)
    return res.data.departamentos
  },

  async addRiesgo(nombre) {
    const res = await api.post('/riesgos', { nombre })
    return res.data
  },

  async updateRiesgo(id, nombre) {
    const res = await api.put(`/riesgos/${id}`, { nombre })
    return res.data
  },

  async removeRiesgoById(id) {
    await api.delete(`/riesgos/id/${id}`)
    return true
  },

  async addPeligro(nombre, riesgoId) {
    const res = await api.post('/peligros', { nombre, riesgoId })
    return res.data
  },

  async updatePeligro(id, nombre, riesgoId) {
    const res = await api.put(`/peligros/${id}`, { nombre, riesgoId })
    return res.data
  },

  async removePeligroById(id) {
    await api.delete(`/peligros/id/${id}`)
    return true
  },

  async getRiesgoPeligroEstructura() {
    const res = await api.get('/catalogo-riesgo-peligro')
    return res.data.estructura
  },

  async getPuestoFuncionEstructura() {
    const res = await api.get('/catalogo-estructura')
    return res.data.estructura
  },

  async addPuesto(nombre, servicioId) {
    const res = await api.post('/puestos', { nombre, servicioId })
    return res.data
  },

  async updatePuesto(id, nombre, servicioId) {
    const res = await api.put(`/puestos/${id}`, { nombre, servicioId })
    return res.data
  },

  async removePuesto(id) {
    await api.delete(`/puestos/${id}`)
    return true
  },

  async addFuncion(nombre, puestoId) {
    const res = await api.post('/funciones', { nombre, puestoId })
    return res.data
  },

  async updateFuncion(id, nombre, puestoId) {
    const res = await api.put(`/funciones/${id}`, { nombre, puestoId })
    return res.data
  },

  async removeFuncion(id) {
    await api.delete(`/funciones/${id}`)
    return true
  },

  async removeRiesgo(nombre) {
    const res = await api.delete(`/riesgos/${encodeURIComponent(nombre)}`)
    return res.data.riesgos
  },

  async removePeligro(nombre) {
    const res = await api.delete(`/peligros/${encodeURIComponent(nombre)}`)
    return res.data.peligros
  },
}
