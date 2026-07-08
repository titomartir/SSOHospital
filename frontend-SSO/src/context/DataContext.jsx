/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { matrizService } from '../services/matrizService'
import { planificacionService } from '../services/planificacionService'
import { catalogoService } from '../services/catalogoService'

const DataContext = createContext(null)

const defaultCatalogos = {
  departamentos: [],
  estructura: [],
  riesgoPeligroEstructura: [],
  peligros: [],
  riesgos: [],
  puestos: [],
  funciones: [],
  escalasProbabilidad: [1, 2, 3, 4, 5],
  escalasConsecuencia: [1, 2, 3, 4, 5],
  clasificaciones: ['Bajo', 'Medio', 'Alto', 'Muy alto'],
}

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [matriz, setMatriz] = useState([])
  const [planificaciones, setPlanificaciones] = useState([])
  const [catalogos, setCatalogos] = useState(defaultCatalogos)

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true)
      try {
        const [matrizData, planData, catData] = await Promise.all([
          matrizService.getAll(),
          planificacionService.getAll(),
          catalogoService.getAll(),
        ])
        setMatriz(matrizData)
        setPlanificaciones(planData)
        setCatalogos({
          ...catData,
          departamentos: catData.estructura.flatMap((sd) => sd.departamentos.map((d) => d.nombre)),
        })
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err)
        toast.error('Error al conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const refreshEstructura = async () => {
    const estructura = await catalogoService.getEstructura()
    setCatalogos((prev) => ({
      ...prev,
      estructura,
      departamentos: estructura.flatMap((sd) => sd.departamentos.map((d) => d.nombre)),
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
    }))
  }

  const refreshRiesgoPeligroEstructura = async () => {
    const riesgoPeligroEstructura = await catalogoService.getRiesgoPeligroEstructura()
    setCatalogos((prev) => ({
      ...prev,
      riesgoPeligroEstructura,
      riesgos: riesgoPeligroEstructura.map((r) => r.nombre),
      peligros: riesgoPeligroEstructura.flatMap((r) => r.peligros.map((p) => p.nombre)),
    }))
  }

  const refreshPuestoFuncionEstructura = async () => {
    await refreshEstructura()
  }

  const createEvaluacion = async (payload) => {
    const newItem = await matrizService.create(payload)
    setMatriz((prev) => [newItem, ...prev])
    toast.success('Evaluación creada')
    return newItem
  }

  const createEvaluacionesBatch = async (payloads) => {
    if (!Array.isArray(payloads) || payloads.length === 0) return []
    return createEvaluacion(payloads[0])
  }

  const updateEvaluacion = async (id, payload) => {
    const updated = await matrizService.update(id, payload)
    setMatriz((prev) => prev.map((item) => (item.id === id ? updated : item)))
    toast.success('Evaluación actualizada')
    return updated
  }

  const deleteEvaluacion = async (id) => {
    await matrizService.remove(id)
    setMatriz((prev) => prev.filter((item) => item.id !== id))
    toast.success('Evaluación eliminada')
  }

  const createPlanificacion = async (payload) => {
    const normalized = { ...payload, evaluacionId: Number(payload.evaluacionId) }
    const newItem = await planificacionService.create(normalized)
    setPlanificaciones((prev) => [newItem, ...prev])
    toast.success('Planificación creada')
    return newItem
  }

  const updatePlanificacion = async (id, payload) => {
    const normalized = { ...payload, evaluacionId: Number(payload.evaluacionId) }
    const updated = await planificacionService.update(id, normalized)
    setPlanificaciones((prev) => prev.map((item) => (item.id === id ? updated : item)))
    toast.success('Planificación actualizada')
    return updated
  }

  const deletePlanificacion = async (id) => {
    await planificacionService.remove(id)
    setPlanificaciones((prev) => prev.filter((item) => item.id !== id))
    toast.success('Planificación eliminada')
  }

  const addDepartamento = async (nombre) => {
    if (!nombre.trim()) return
    const departamentos = await catalogoService.addDepartamento(nombre.trim())
    setCatalogos((prev) => ({ ...prev, departamentos }))
    toast.success('Departamento agregado')
  }

  const removeDepartamento = async (nombre) => {
    const departamentos = await catalogoService.removeDepartamento(nombre)
    setCatalogos((prev) => ({ ...prev, departamentos }))
    toast.success('Departamento eliminado')
  }

  const addSubDireccion = async (nombre) => {
    if (!nombre.trim()) return
    await catalogoService.addSubDireccion(nombre.trim())
    await refreshEstructura()
    toast.success('Sub dirección agregada')
  }

  const updateSubDireccion = async (id, nombre) => {
    if (!nombre.trim()) return
    await catalogoService.updateSubDireccion(id, nombre.trim())
    await refreshEstructura()
    toast.success('Sub dirección actualizada')
  }

  const removeSubDireccion = async (id) => {
    try {
      await catalogoService.removeSubDireccion(id)
      await refreshEstructura()
      toast.success('Sub dirección eliminada')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar sub dirección'
      toast.error(message)
    }
  }

  const addDepartamentoToSubDireccion = async (nombre, subDireccionId) => {
    if (!nombre.trim() || !subDireccionId) return
    await catalogoService.addDepartamentoToSubDireccion(nombre.trim(), subDireccionId)
    await refreshEstructura()
    toast.success('Departamento agregado')
  }

  const updateDepartamentoById = async (id, nombre, subDireccionId) => {
    if (!nombre.trim() || !subDireccionId) return
    await catalogoService.updateDepartamento(id, nombre.trim(), subDireccionId)
    await refreshEstructura()
    toast.success('Departamento actualizado')
  }

  const removeDepartamentoById = async (id) => {
    try {
      await catalogoService.removeDepartamentoById(id)
      await refreshEstructura()
      toast.success('Departamento eliminado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar departamento'
      toast.error(message)
    }
  }

  const addServicio = async (nombre, departamentoId) => {
    if (!nombre.trim() || !departamentoId) return
    await catalogoService.addServicio(nombre.trim(), departamentoId)
    await refreshEstructura()
    toast.success('Servicio agregado')
  }

  const updateServicio = async (id, nombre, departamentoId) => {
    if (!nombre.trim() || !departamentoId) return
    await catalogoService.updateServicio(id, nombre.trim(), departamentoId)
    await refreshEstructura()
    toast.success('Servicio actualizado')
  }

  const removeServicio = async (id) => {
    try {
      await catalogoService.removeServicio(id)
      await refreshEstructura()
      toast.success('Servicio eliminado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar servicio'
      toast.error(message)
    }
  }

  const addRiesgo = async (nombre) => {
    try {
      if (!nombre.trim()) return
      await catalogoService.addRiesgo(nombre.trim())
      await refreshRiesgoPeligroEstructura()
      toast.success('Riesgo agregado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al agregar riesgo'
      toast.error(message)
    }
  }

  const updateRiesgo = async (id, nombre) => {
    try {
      if (!nombre.trim()) return
      await catalogoService.updateRiesgo(id, nombre.trim())
      await refreshRiesgoPeligroEstructura()
      toast.success('Riesgo actualizado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al actualizar riesgo'
      toast.error(message)
    }
  }

  const addPeligro = async (nombre, riesgoId) => {
    try {
      if (!nombre.trim() || !riesgoId) return
      await catalogoService.addPeligro(nombre.trim(), riesgoId)
      await refreshRiesgoPeligroEstructura()
      toast.success('Peligro agregado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al agregar peligro'
      toast.error(message)
    }
  }

  const updatePeligro = async (id, nombre, riesgoId) => {
    try {
      if (!nombre.trim() || !riesgoId) return
      await catalogoService.updatePeligro(id, nombre.trim(), riesgoId)
      await refreshRiesgoPeligroEstructura()
      toast.success('Peligro actualizado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al actualizar peligro'
      toast.error(message)
    }
  }

  const removeRiesgo = async (id) => {
    try {
      await catalogoService.removeRiesgoById(id)
      await refreshRiesgoPeligroEstructura()
      toast.success('Riesgo eliminado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar el riesgo'
      toast.error(message)
    }
  }

  const removePeligro = async (id) => {
    try {
      await catalogoService.removePeligroById(id)
      await refreshRiesgoPeligroEstructura()
      toast.success('Peligro eliminado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar el peligro'
      toast.error(message)
    }
  }

  const addPuesto = async (nombre, servicioId) => {
    try {
      if (!nombre.trim() || !servicioId) return
      await catalogoService.addPuesto(nombre.trim(), servicioId)
      await refreshEstructura()
      toast.success('Puesto agregado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al agregar puesto'
      toast.error(message)
    }
  }

  const updatePuesto = async (id, nombre, servicioId) => {
    try {
      if (!nombre.trim() || !servicioId) return
      await catalogoService.updatePuesto(id, nombre.trim(), servicioId)
      await refreshEstructura()
      toast.success('Puesto actualizado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al actualizar puesto'
      toast.error(message)
    }
  }

  const removePuesto = async (id) => {
    try {
      await catalogoService.removePuesto(id)
      await refreshPuestoFuncionEstructura()
      toast.success('Puesto eliminado')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar puesto'
      toast.error(message)
    }
  }

  const addFuncion = async (nombre, puestoId) => {
    try {
      if (!nombre.trim() || !puestoId) return
      await catalogoService.addFuncion(nombre.trim(), puestoId)
      await refreshPuestoFuncionEstructura()
      toast.success('Función agregada')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al agregar función'
      toast.error(message)
    }
  }

  const updateFuncion = async (id, nombre, puestoId) => {
    try {
      if (!nombre.trim() || !puestoId) return
      await catalogoService.updateFuncion(id, nombre.trim(), puestoId)
      await refreshPuestoFuncionEstructura()
      toast.success('Función actualizada')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al actualizar función'
      toast.error(message)
    }
  }

  const removeFuncion = async (id) => {
    try {
      await catalogoService.removeFuncion(id)
      await refreshPuestoFuncionEstructura()
      toast.success('Función eliminada')
    } catch (err) {
      const message = err.response?.data?.error || 'Error al eliminar función'
      toast.error(message)
    }
  }

  const stats = useMemo(() => {
    const total = matriz.length
    const altos = matriz.filter((item) => ['Alto', 'Muy alto'].includes(item.clasificacion)).length
    const departamentos = new Set(matriz.map((item) => item.departamento)).size
    const pendientes = planificaciones.filter((item) => item.estado !== 'completado').length

    return {
      totalEvaluaciones: total,
      riesgosAltos: altos,
      departamentosEvaluados: departamentos,
      pendientesPlanificacion: pendientes,
    }
  }, [matriz, planificaciones])

  const value = {
    loading,
    matriz,
    planificaciones,
    catalogos,
    stats,
    createEvaluacion,
    createEvaluacionesBatch,
    updateEvaluacion,
    deleteEvaluacion,
    createPlanificacion,
    updatePlanificacion,
    deletePlanificacion,
    addDepartamento,
    removeDepartamento,
    addSubDireccion,
    updateSubDireccion,
    removeSubDireccion,
    addDepartamentoToSubDireccion,
    updateDepartamentoById,
    removeDepartamentoById,
    addServicio,
    updateServicio,
    removeServicio,
    addRiesgo,
    updateRiesgo,
    removeRiesgo,
    addPeligro,
    updatePeligro,
    removePeligro,
    addPuesto,
    updatePuesto,
    removePuesto,
    addFuncion,
    updateFuncion,
    removeFuncion,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData debe usarse dentro de DataProvider')
  return context
}
