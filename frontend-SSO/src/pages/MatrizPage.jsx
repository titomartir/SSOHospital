import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiDownload, FiEdit2, FiEye, FiFileText, FiPlus, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Button from '../components/Button'
import Badge from '../components/Badge'
import DataTable from '../components/DataTable'
import InputField from '../components/InputField'
import Modal from '../components/Modal'
import SelectField from '../components/SelectField'
import { useData } from '../context/DataContext'
import { useFilters } from '../hooks/useFilters'
import { useForm } from '../hooks/useForm'
import { calculateRiskLevel, classifyRisk } from '../utils/calculators'
import { formatDate } from '../utils/formatters'
import { validateMatrizForm } from '../utils/validators'
import { matrizService } from '../services/matrizService'

const createRiesgoAsociado = () => ({
  riesgoId: '',
  peligroId: '',
  probabilidad: 1,
  consecuencia: 1,
  medidasPrev: '',
  acciones: '',
  recursos: '',
  fechaCumplimiento: '',
  responsable: '',
  estado: 'pendiente',
})

const createFuncionBloque = () => ({
  funcionId: '',
  riesgosAsociados: [createRiesgoAsociado()],
})

const emptyForm = {
  fecha: '',
  subDireccionId: '',
  departamentoId: '',
  servicioId: '',
  puestoId: '',
  ubicacion: '',
  estado: 'pendiente',
  funciones: [createFuncionBloque()],
  observaciones: '',
}

const printableBadgeClass = (value) => {
  if (value === 'Bajo') return 'background: rgba(16,185,129,0.14); color: #047857;'
  if (value === 'Medio') return 'background: rgba(245,158,11,0.16); color: #b45309;'
  if (value === 'Alto') return 'background: rgba(249,115,22,0.16); color: #c2410c;'
  if (value === 'Muy alto') return 'background: rgba(239,68,68,0.14); color: #b91c1c;'
  return 'background: #f3f4f6; color: #374151;'
}

const getDisplayFunciones = (evaluation) => {
  if (Array.isArray(evaluation?.funciones) && evaluation.funciones.length > 0) return evaluation.funciones
  return [{ funcion: evaluation?.funcion || '', riesgosAsociados: evaluation?.riesgosAsociados || [] }]
}

const hasOnlyOneEmptyFunctionBlock = (funciones = []) => {
  if (!Array.isArray(funciones) || funciones.length !== 1) return false
  const first = funciones[0] || {}
  const riesgos = Array.isArray(first.riesgosAsociados) ? first.riesgosAsociados : []
  if (riesgos.length !== 1) return false

  const risk = riesgos[0] || {}
  return (
    !first.funcionId &&
    !risk.riesgoId &&
    !risk.peligroId &&
    Number(risk.probabilidad || 1) === 1 &&
    Number(risk.consecuencia || 1) === 1 &&
    !risk.medidasPrev &&
    !risk.acciones &&
    !risk.recursos &&
    !risk.fechaCumplimiento &&
    !risk.responsable &&
    (risk.estado || 'pendiente') === 'pendiente'
  )
}

const buildPrintableHtml = (evaluation) => {
  const generalFields = [
    ['Fecha', formatDate(evaluation.fecha)],
    ['Sub Dirección', evaluation.subDireccion || '-'],
    ['Departamento', evaluation.departamento || '-'],
    ['Servicio', evaluation.servicio || '-'],
    ['Puesto', evaluation.puesto || '-'],
    ['Ubicación física', evaluation.ubicacion || '-'],
  ]

  const funcionesHtml = getDisplayFunciones(evaluation)
    .map((funcion, functionIndex) => {
      const risksHtml = (funcion.riesgosAsociados || [])
        .map(
          (risk, index) => `
      <section class="risk-block">
        <div class="risk-head">
          <div>Riesgo #${index + 1}</div>
          <div class="chip" style="${printableBadgeClass(risk.clasificacion)}">${risk.clasificacion || '-'}</div>
        </div>
        <div class="risk-grid">
          <div class="print-field"><div class="label">Riesgo</div><div class="value">${risk.riesgo || '-'}</div></div>
          <div class="print-field"><div class="label">Peligro</div><div class="value">${risk.peligro || '-'}</div></div>
          <div class="print-field"><div class="label">Probabilidad</div><div class="value">${risk.probabilidad ?? '-'}</div></div>
          <div class="print-field"><div class="label">Consecuencia</div><div class="value">${risk.consecuencia ?? '-'}</div></div>
          <div class="print-field"><div class="label">Nivel</div><div class="value">${risk.nivel ?? '-'}</div></div>
          <div class="print-field"><div class="label">Clasificación</div><div class="value">${risk.clasificacion || '-'}</div></div>
          <div class="print-field full"><div class="label">Medidas Preventivas</div><div class="value">${risk.medidasPrev || '-'}</div></div>
          <div class="print-field full"><div class="label">Acciones</div><div class="value">${risk.acciones || '-'}</div></div>
          <div class="print-field full"><div class="label">Recursos</div><div class="value">${risk.recursos || '-'}</div></div>
        </div>
        <div class="risk-grid-3">
          <div class="print-field"><div class="label">Fecha de cumplimiento</div><div class="value">${formatDate(risk.fechaCumplimiento) || '-'}</div></div>
          <div class="print-field"><div class="label">Responsable</div><div class="value">${risk.responsable || '-'}</div></div>
          <div class="print-field"><div class="label">Estado</div><div class="value">${risk.estado || '-'}</div></div>
        </div>
      </section>
    `
        )
        .join('')

      return `
      <section class="function-block">
        <div class="function-title">FUNCIÓN ${functionIndex + 1}</div>
        <div class="print-field full function-name">
          <div class="label">Función</div>
          <div class="value">${funcion.funcion || '-'}</div>
        </div>
        ${risksHtml || '<div class="print-field"><div class="value">Sin riesgos asociados</div></div>'}
      </section>
    `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Evaluación ${evaluation.id}</title>
      <style>
        @page { size: A4; margin: 12mm; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #111827; background: #fff; }
        .sheet { padding: 0; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .title { font-size: 20px; font-weight: 700; margin: 0 0 6px; }
        .subtitle { font-size: 12px; color: #475569; margin: 0; }
        .meta {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 12px;
          min-width: 160px;
          text-align: right;
        }
        .meta-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
        .meta-value { font-size: 14px; font-weight: 700; margin-top: 4px; }
        .section-title { font-size: 16px; font-weight: 700; margin: 18px 0 10px; }
        .general-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .print-field {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 12px;
          min-height: 58px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .label { font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 13px; font-weight: 600; white-space: pre-wrap; word-break: break-word; }
        .full { grid-column: 1 / -1; }
        .function-block {
          border: 2px solid #1d4ed8;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 14px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .function-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          color: #1d4ed8;
          text-transform: uppercase;
        }
        .function-name { margin-bottom: 10px; }
        .risk-block {
          border: 1px solid #94a3b8;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .risk-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 13px;
        }
        .chip {
          border-radius: 9999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
        }
        .risk-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .risk-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }
        .foot { margin-top: 16px; font-size: 11px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="sheet">
        <div class="header">
          <div>
            <h1 class="title">Matriz de Riesgos</h1>
            <p class="subtitle">Evaluación ${evaluation.id}</p>
          </div>
          <div class="meta">
            <div class="meta-label">Estado</div>
            <div class="meta-value">${evaluation.estado || 'pendiente'}</div>
          </div>
        </div>

        <div class="section-title">Información General</div>
        <div class="general-grid">
          ${generalFields
            .map(
              ([label, value]) => `
            <div class="print-field">
              <div class="label">${label}</div>
              <div class="value">${value || '-'}</div>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="section-title">Funciones y Riesgos Asociados</div>
        ${funcionesHtml || '<div class="print-field"><div class="value">Sin funciones asociadas</div></div>'}

        <div class="foot">Documento generado por el sistema SSO.</div>
      </div>
    </body>
    </html>
  `
}

const openPrintableWindow = (evaluation, win = null) => {
  const html = buildPrintableHtml(evaluation)
  const printableWindow = win || window.open('', '_blank', 'width=1100,height=900')
  if (!printableWindow) return
  printableWindow.document.open()
  printableWindow.document.write(html)
  printableWindow.document.close()
  printableWindow.focus()
  printableWindow.onload = () => {
    printableWindow.print()
  }
}

const MatrizPage = () => {
  const { matriz, catalogos, createEvaluacion, updateEvaluacion, deleteEvaluacion } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState(null)
  const [loadingEvaluation, setLoadingEvaluation] = useState(false)

  const { filters, updateFilter, filteredData } = useFilters(matriz, (rows, activeFilters) => {
    return rows.filter((item) => {
      const bySubDireccion = activeFilters.subDireccion ? item.subDireccion === activeFilters.subDireccion : true
      const byDepartamento = activeFilters.departamento ? item.departamento === activeFilters.departamento : true
      const byServicio = activeFilters.servicio ? item.servicio === activeFilters.servicio : true
      const byPuesto = activeFilters.puesto ? item.puesto === activeFilters.puesto : true
      const byFromDate = activeFilters.fechaDesde ? item.fecha >= activeFilters.fechaDesde : true
      const byToDate = activeFilters.fechaHasta ? item.fecha <= activeFilters.fechaHasta : true
      return bySubDireccion && byDepartamento && byServicio && byPuesto && byFromDate && byToDate
    })
  })

  const subDireccionFilterOptions = useMemo(
    () => [...new Set((matriz || []).map((item) => item.subDireccion).filter(Boolean))],
    [matriz]
  )

  const departamentoFilterOptions = useMemo(() => {
    const pool = (matriz || []).filter((item) => (filters.subDireccion ? item.subDireccion === filters.subDireccion : true))
    return [...new Set(pool.map((item) => item.departamento).filter(Boolean))]
  }, [filters.subDireccion, matriz])

  const servicioFilterOptions = useMemo(() => {
    const pool = (matriz || []).filter((item) => {
      const bySubDireccion = filters.subDireccion ? item.subDireccion === filters.subDireccion : true
      const byDepartamento = filters.departamento ? item.departamento === filters.departamento : true
      return bySubDireccion && byDepartamento
    })
    return [...new Set(pool.map((item) => item.servicio).filter(Boolean))]
  }, [filters.departamento, filters.subDireccion, matriz])

  const puestoFilterOptions = useMemo(() => {
    const pool = (matriz || []).filter((item) => {
      const bySubDireccion = filters.subDireccion ? item.subDireccion === filters.subDireccion : true
      const byDepartamento = filters.departamento ? item.departamento === filters.departamento : true
      const byServicio = filters.servicio ? item.servicio === filters.servicio : true
      return bySubDireccion && byDepartamento && byServicio
    })
    return [...new Set(pool.map((item) => item.puesto).filter(Boolean))]
  }, [filters.departamento, filters.servicio, filters.subDireccion, matriz])

  useEffect(() => {
    if (filters.departamento && !departamentoFilterOptions.includes(filters.departamento)) {
      updateFilter('departamento', '')
      updateFilter('servicio', '')
      updateFilter('puesto', '')
      return
    }

    if (filters.servicio && !servicioFilterOptions.includes(filters.servicio)) {
      updateFilter('servicio', '')
      updateFilter('puesto', '')
      return
    }

    if (filters.puesto && !puestoFilterOptions.includes(filters.puesto)) {
      updateFilter('puesto', '')
    }
  }, [
    departamentoFilterOptions,
    filters.departamento,
    filters.puesto,
    filters.servicio,
    puestoFilterOptions,
    servicioFilterOptions,
    updateFilter,
  ])

  const { values, errors, handleChange, handleSubmit, resetForm, setValues } = useForm(emptyForm, validateMatrizForm)

  const subDirecciones = useMemo(() => catalogos.estructura || [], [catalogos.estructura])
  const selectedSubDireccion = useMemo(
    () => subDirecciones.find((item) => String(item.id) === String(values.subDireccionId)) || null,
    [subDirecciones, values.subDireccionId]
  )

  const departamentoOptions = useMemo(
    () =>
      (selectedSubDireccion?.departamentos || []).map((dep) => ({
        value: dep.id,
        label: dep.nombre,
        servicios: dep.servicios,
      })),
    [selectedSubDireccion]
  )

  const selectedDepartamento = useMemo(
    () => departamentoOptions.find((item) => String(item.value) === String(values.departamentoId)) || null,
    [departamentoOptions, values.departamentoId]
  )

  const servicioOptions = useMemo(
    () =>
      (selectedDepartamento?.servicios || []).map((srv) => ({
        value: srv.id,
        label: srv.nombre,
        puestos: srv.puestos,
      })),
    [selectedDepartamento]
  )

  const selectedServicio = useMemo(
    () => servicioOptions.find((item) => String(item.value) === String(values.servicioId)) || null,
    [servicioOptions, values.servicioId]
  )

  const puestoOptions = useMemo(
    () =>
      (selectedServicio?.puestos || []).map((puesto) => ({
        value: puesto.id,
        label: puesto.nombre,
        funciones: puesto.funciones,
      })),
    [selectedServicio]
  )

  const selectedPuesto = useMemo(
    () => puestoOptions.find((item) => String(item.value) === String(values.puestoId)) || null,
    [puestoOptions, values.puestoId]
  )

  const funcionOptions = useMemo(
    () => (selectedPuesto?.funciones || []).map((funcion) => ({ value: funcion.id, label: funcion.nombre })),
    [selectedPuesto]
  )

  const riesgosEstructura = useMemo(() => catalogos.riesgoPeligroEstructura || [], [catalogos.riesgoPeligroEstructura])
  const riesgoOptions = useMemo(
    () => riesgosEstructura.map((r) => ({ value: r.id, label: r.nombre, peligros: r.peligros })),
    [riesgosEstructura]
  )

  const getPeligroOptionsByRiesgoId = useCallback(
    (riesgoId) => {
      const selectedRiesgo = riesgoOptions.find((item) => String(item.value) === String(riesgoId)) || null
      return (selectedRiesgo?.peligros || []).map((p) => ({ value: p.id, label: p.nombre }))
    },
    [riesgoOptions]
  )

  const updateFuncionBloque = (funcionIndex, field, value) => {
    setValues((prev) => {
      const funciones = [...(prev.funciones || [])]
      const current = funciones[funcionIndex] || createFuncionBloque()
      const nextFuncion = { ...current, [field]: value }
      funciones[funcionIndex] = nextFuncion
      return { ...prev, funciones }
    })
  }

  const updateRiesgoAsociado = (funcionIndex, riesgoIndex, field, value) => {
    setValues((prev) => {
      const funciones = [...(prev.funciones || [])]
      const funcion = funciones[funcionIndex] || createFuncionBloque()
      const riesgos = [...(funcion.riesgosAsociados || [])]
      const current = riesgos[riesgoIndex] || createRiesgoAsociado()
      const next = { ...current, [field]: value }
      if (field === 'riesgoId') next.peligroId = ''
      riesgos[riesgoIndex] = next
      funciones[funcionIndex] = { ...funcion, riesgosAsociados: riesgos }
      return { ...prev, funciones }
    })
  }

  const addFuncionBloque = () => {
    setValues((prev) => ({
      ...prev,
      funciones: [...(prev.funciones || []), createFuncionBloque()],
    }))
  }

  const removeFuncionBloque = (funcionIndex) => {
    setValues((prev) => {
      const funciones = prev.funciones || []
      if (funciones.length <= 1) return prev
      return { ...prev, funciones: funciones.filter((_, idx) => idx !== funcionIndex) }
    })
  }

  const addRiesgoAsociado = (funcionIndex) => {
    setValues((prev) => {
      const funciones = [...(prev.funciones || [])]
      const funcion = funciones[funcionIndex] || createFuncionBloque()
      funciones[funcionIndex] = {
        ...funcion,
        riesgosAsociados: [...(funcion.riesgosAsociados || []), createRiesgoAsociado()],
      }
      return { ...prev, funciones }
    })
  }

  const removeRiesgoAsociado = (funcionIndex, riesgoIndex) => {
    setValues((prev) => {
      const funciones = [...(prev.funciones || [])]
      const funcion = funciones[funcionIndex] || createFuncionBloque()
      const riesgos = funcion.riesgosAsociados || []
      if (riesgos.length <= 1) return prev
      funciones[funcionIndex] = {
        ...funcion,
        riesgosAsociados: riesgos.filter((_, idx) => idx !== riesgoIndex),
      }
      return { ...prev, funciones }
    })
  }

  useEffect(() => {
    if (!values.subDireccionId) {
      if (values.departamentoId || values.servicioId || values.puestoId) {
        setValues((prev) => ({ ...prev, departamentoId: '', servicioId: '', puestoId: '', funciones: [createFuncionBloque()] }))
      } else if (!hasOnlyOneEmptyFunctionBlock(values.funciones)) {
        setValues((prev) => ({ ...prev, funciones: [createFuncionBloque()] }))
      }
      return
    }

    if (values.departamentoId && !departamentoOptions.some((item) => String(item.value) === String(values.departamentoId))) {
      setValues((prev) => ({ ...prev, departamentoId: '', servicioId: '', puestoId: '', funciones: [createFuncionBloque()] }))
    }
  }, [departamentoOptions, setValues, values.departamentoId, values.puestoId, values.servicioId, values.subDireccionId])

  useEffect(() => {
    if (!values.departamentoId) {
      if (values.servicioId || values.puestoId) {
        setValues((prev) => ({ ...prev, servicioId: '', puestoId: '', funciones: [createFuncionBloque()] }))
      } else if (!hasOnlyOneEmptyFunctionBlock(values.funciones)) {
        setValues((prev) => ({ ...prev, funciones: [createFuncionBloque()] }))
      }
      return
    }

    if (values.servicioId && !servicioOptions.some((item) => String(item.value) === String(values.servicioId))) {
      setValues((prev) => ({ ...prev, servicioId: '', puestoId: '', funciones: [createFuncionBloque()] }))
    }
  }, [servicioOptions, setValues, values.departamentoId, values.puestoId, values.servicioId])

  useEffect(() => {
    if (!values.servicioId) {
      if (values.puestoId) {
        setValues((prev) => ({ ...prev, puestoId: '', funciones: [createFuncionBloque()] }))
      } else if (!hasOnlyOneEmptyFunctionBlock(values.funciones)) {
        setValues((prev) => ({ ...prev, funciones: [createFuncionBloque()] }))
      }
      return
    }

    if (values.puestoId && !puestoOptions.some((item) => String(item.value) === String(values.puestoId))) {
      setValues((prev) => ({ ...prev, puestoId: '', funciones: [createFuncionBloque()] }))
    }
  }, [puestoOptions, setValues, values.puestoId, values.servicioId])

  useEffect(() => {
    if (!values.puestoId) {
      if (!hasOnlyOneEmptyFunctionBlock(values.funciones)) {
        setValues((prev) => ({ ...prev, funciones: [createFuncionBloque()] }))
      }
      return
    }

    let changed = false
    const normalizedFunciones = (values.funciones || []).map((funcion) => {
      const valid = funcionOptions.some((item) => String(item.value) === String(funcion.funcionId))
      if (funcion.funcionId && !valid) {
        changed = true
        return { ...funcion, funcionId: '' }
      }
      return funcion
    })

    if (changed) {
      setValues((prev) => ({ ...prev, funciones: normalizedFunciones }))
    }
  }, [funcionOptions, setValues, values.funciones, values.puestoId])

  useEffect(() => {
    const funciones = values.funciones || []
    let hasChanges = false

    const normalizedFunciones = funciones.map((funcion) => {
      const normalizedRiesgos = (funcion.riesgosAsociados || []).map((item) => {
        const riesgoValido = riesgoOptions.some((opt) => String(opt.value) === String(item.riesgoId))
        if (!riesgoValido) {
          if (item.riesgoId || item.peligroId) hasChanges = true
          return { ...item, riesgoId: '', peligroId: '' }
        }

        const peligrosPermitidos = getPeligroOptionsByRiesgoId(item.riesgoId)
        const peligroValido = peligrosPermitidos.some((opt) => String(opt.value) === String(item.peligroId))

        if (!peligroValido && item.peligroId) {
          hasChanges = true
          return { ...item, peligroId: '' }
        }

        return item
      })

      return { ...funcion, riesgosAsociados: normalizedRiesgos }
    })

    if (hasChanges) {
      setValues((prev) => ({ ...prev, funciones: normalizedFunciones }))
    }
  }, [getPeligroOptionsByRiesgoId, riesgoOptions, setValues, values.funciones])

  const onOpenCreate = () => {
    setEditingItem(null)
    resetForm(emptyForm)
    setModalOpen(true)
  }

  const loadDetail = async (id) => {
    setLoadingEvaluation(true)
    try {
      const detail = await matrizService.getById(id)
      setSelectedEvaluation(detail)
      return detail
    } finally {
      setLoadingEvaluation(false)
    }
  }

  const onView = async (item) => {
    const detail = await loadDetail(item.id)
    setSelectedEvaluation(detail)
    setDetailOpen(true)
  }

  const onPrint = async (item) => {
    const printWindow = window.open('', '_blank', 'width=1100,height=900')
    if (!printWindow) return
    printWindow.document.write('<p style="font-family: Arial, sans-serif; padding: 24px;">Cargando documento...</p>')
    const detail = await loadDetail(item.id)
    openPrintableWindow(detail, printWindow)
  }

  const onPdf = async (item) => {
    const printWindow = window.open('', '_blank', 'width=1100,height=900')
    if (!printWindow) return
    printWindow.document.write('<p style="font-family: Arial, sans-serif; padding: 24px;">Cargando documento...</p>')
    const detail = await loadDetail(item.id)
    openPrintableWindow(detail, printWindow)
  }

  const onEdit = async (item) => {
    const detail = await loadDetail(item.id)
    setEditingItem(detail)

    const funciones = Array.isArray(detail.funciones) && detail.funciones.length > 0
      ? detail.funciones
      : [{ funcionId: detail.funcionId || '', riesgosAsociados: detail.riesgosAsociados || [] }]

    setValues({
      fecha: detail.fecha || '',
      subDireccionId: detail.subDireccionId || '',
      departamentoId: detail.departamentoId || '',
      servicioId: detail.servicioId || '',
      puestoId: detail.puestoId || '',
      ubicacion: detail.ubicacion || '',
      estado: detail.estado || 'pendiente',
      funciones: funciones.map((funcion) => ({
        funcionId: funcion.funcionId || '',
        riesgosAsociados: (funcion.riesgosAsociados || []).map((risk) => ({
          riesgoId: risk.riesgoId || '',
          peligroId: risk.peligroId || '',
          probabilidad: risk.probabilidad || 1,
          consecuencia: risk.consecuencia || 1,
          medidasPrev: risk.medidasPrev || '',
          acciones: risk.acciones || '',
          recursos: risk.recursos || '',
          fechaCumplimiento: risk.fechaCumplimiento || '',
          responsable: risk.responsable || '',
          estado: risk.estado || 'pendiente',
        })),
      })),
      observaciones: detail.observaciones || '',
    })
    setModalOpen(true)
  }

  const onSubmit = async (formValues) => {
    const payload = {
      ...formValues,
      funciones: formValues.funciones || [],
    }

    if (editingItem) {
      await updateEvaluacion(editingItem.id, payload)
    } else {
      await createEvaluacion(payload)
    }

    setModalOpen(false)
    setEditingItem(null)
    resetForm(emptyForm)
  }

  const onDelete = async (item) => {
    if (!window.confirm(`¿Eliminar la evaluación de ${item.departamento} - ${item.servicio} - ${item.puesto}?`)) return
    await deleteEvaluacion(item.id)
  }

  const columns = [
    { key: 'fecha', title: 'Fecha', render: (value) => formatDate(value) },
    { key: 'subDireccion', title: 'Sub Dirección' },
    { key: 'departamento', title: 'Departamento' },
    { key: 'servicio', title: 'Servicio' },
    { key: 'puesto', title: 'Puesto' },
    { key: 'funcionesCount', title: 'Cantidad de Funciones', render: (value) => value ?? 0 },
    { key: 'riesgosCount', title: 'Total de Riesgos Asociados', render: (value) => value ?? 0 },
    {
      key: 'acciones',
      title: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button type="button" className="text-primary" title="Ver detalle" onClick={() => onView(row)}>
            <FiEye />
          </button>
          <button type="button" className="text-gray-600 dark:text-gray-300" title="Imprimir" onClick={() => onPrint(row)}>
            <FiPrinter />
          </button>
          <button type="button" className="text-secondary" title="Exportar a PDF" onClick={() => onPdf(row)}>
            <FiDownload />
          </button>
          <button type="button" className="text-secondary" title="Editar" onClick={() => onEdit(row)}>
            <FiEdit2 />
          </button>
          <button type="button" className="text-danger" title="Eliminar" onClick={() => onDelete(row)}>
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SelectField
            label="Sub Dirección"
            value={filters.subDireccion || ''}
            onChange={(e) => updateFilter('subDireccion', e.target.value)}
            options={[{ value: '', label: 'Todas' }, ...subDireccionFilterOptions.map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Departamento"
            value={filters.departamento || ''}
            onChange={(e) => updateFilter('departamento', e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...departamentoFilterOptions.map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Servicio"
            value={filters.servicio || ''}
            onChange={(e) => updateFilter('servicio', e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...servicioFilterOptions.map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Puesto"
            value={filters.puesto || ''}
            onChange={(e) => updateFilter('puesto', e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...puestoFilterOptions.map((item) => ({ value: item, label: item }))]}
          />
          <InputField
            label="Fecha desde"
            type="date"
            value={filters.fechaDesde || ''}
            onChange={(e) => updateFilter('fechaDesde', e.target.value)}
          />
          <InputField
            label="Fecha hasta"
            type="date"
            value={filters.fechaHasta || ''}
            onChange={(e) => updateFilter('fechaHasta', e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onOpenCreate} className="gap-2">
            <FiPlus /> Agregar evaluación
          </Button>
          <Button variant="secondary" className="gap-2">
            <FiFileText /> Exportar a Excel
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Editar evaluación' : 'Nueva evaluación de riesgo'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <InputField label="Fecha" name="fecha" type="date" value={values.fecha} onChange={handleChange} error={errors.fecha} />
            <SelectField
              label="Sub Dirección"
              name="subDireccionId"
              value={values.subDireccionId}
              onChange={handleChange}
              error={errors.subDireccionId}
              options={[{ value: '', label: 'Seleccione una sub dirección' }, ...subDirecciones.map((item) => ({ value: item.id, label: item.nombre }))]}
            />
            <SelectField
              label="Departamento"
              name="departamentoId"
              value={values.departamentoId}
              onChange={handleChange}
              error={errors.departamentoId}
              disabled={!values.subDireccionId}
              options={[{ value: '', label: 'Seleccione un departamento' }, ...departamentoOptions.map((item) => ({ value: item.value, label: item.label }))]}
            />
            <SelectField
              label="Servicio"
              name="servicioId"
              value={values.servicioId}
              onChange={handleChange}
              error={errors.servicioId}
              disabled={!values.departamentoId}
              options={[{ value: '', label: 'Seleccione un servicio' }, ...servicioOptions.map((item) => ({ value: item.value, label: item.label }))]}
            />
            <SelectField
              label="Puesto"
              name="puestoId"
              value={values.puestoId}
              onChange={handleChange}
              error={errors.puestoId}
              disabled={!values.servicioId}
              options={[{ value: '', label: 'Seleccione un puesto' }, ...puestoOptions.map((item) => ({ value: item.value, label: item.label }))]}
            />
            <InputField label="Ubicación física" name="ubicacion" value={values.ubicacion} onChange={handleChange} error={errors.ubicacion} />
          </div>

          {typeof errors.funciones === 'string' && <span className="block text-xs text-danger">{errors.funciones}</span>}

          {(values.funciones || []).map((funcion, funcionIndex) => {
            const functionErrors = Array.isArray(errors.funciones) ? errors.funciones[funcionIndex] || {} : {}
            const riesgosErrors = Array.isArray(functionErrors.riesgosAsociados) ? functionErrors.riesgosAsociados : []

            return (
              <section key={`funcion-${funcionIndex}`} className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Función #{funcionIndex + 1}</h3>
                  {(values.funciones || []).length > 1 && (
                    <button
                      type="button"
                      className="inline-flex items-center text-danger"
                      onClick={() => removeFuncionBloque(funcionIndex)}
                      title="Eliminar función"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>

                <SelectField
                  label="Función"
                  value={funcion.funcionId || ''}
                  onChange={(e) => updateFuncionBloque(funcionIndex, 'funcionId', e.target.value)}
                  error={functionErrors.funcionId}
                  disabled={!values.puestoId}
                  options={[{ value: '', label: 'Seleccione una función' }, ...funcionOptions.map((item) => ({ value: item.value, label: item.label }))]}
                />

                {funcion.funcionId && (
                  <section className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Riesgos Asociados</h4>
                      <Button type="button" className="gap-2" onClick={() => addRiesgoAsociado(funcionIndex)}>
                        <FiPlus /> Agregar Nuevo Riesgo
                      </Button>
                    </div>

                    {typeof functionErrors.riesgosAsociados === 'string' && (
                      <span className="block text-xs text-danger">{functionErrors.riesgosAsociados}</span>
                    )}

                    {(funcion.riesgosAsociados || []).map((item, riskIndex) => {
                      const peligroOptions = getPeligroOptionsByRiesgoId(item.riesgoId)
                      const nivel = calculateRiskLevel(item.probabilidad, item.consecuencia)
                      const clasificacion = classifyRisk(nivel)
                      const blockErrors = riesgosErrors[riskIndex] || {}

                      return (
                        <div key={`funcion-${funcionIndex}-riesgo-${riskIndex}`} className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Riesgo #{riskIndex + 1}</span>
                            {(funcion.riesgosAsociados || []).length > 1 && (
                              <button
                                type="button"
                                className="inline-flex items-center text-danger"
                                onClick={() => removeRiesgoAsociado(funcionIndex, riskIndex)}
                                title="Eliminar riesgo"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <SelectField
                              label="Riesgo"
                              value={item.riesgoId}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'riesgoId', e.target.value)}
                              error={blockErrors.riesgoId}
                              options={[{ value: '', label: 'Seleccione un riesgo' }, ...riesgoOptions.map((opt) => ({ value: opt.value, label: opt.label }))]}
                            />
                            <SelectField
                              label="Peligro"
                              value={item.peligroId}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'peligroId', e.target.value)}
                              error={blockErrors.peligroId}
                              disabled={!item.riesgoId}
                              options={[{ value: '', label: 'Seleccione un peligro' }, ...peligroOptions]}
                            />
                            <SelectField
                              label="Probabilidad"
                              value={item.probabilidad}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'probabilidad', Number(e.target.value))}
                              error={blockErrors.probabilidad}
                              options={catalogos.escalasProbabilidad}
                            />
                            <SelectField
                              label="Consecuencia"
                              value={item.consecuencia}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'consecuencia', Number(e.target.value))}
                              error={blockErrors.consecuencia}
                              options={catalogos.escalasConsecuencia}
                            />
                            <InputField label="Nivel de riesgo" value={nivel} readOnly />
                            <InputField label="Clasificación" value={clasificacion} readOnly />
                          </div>

                          <label className="block">
                            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Medidas preventivas</span>
                            <textarea
                              rows="3"
                              value={item.medidasPrev || ''}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'medidasPrev', e.target.value)}
                              maxLength={2000}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                            />
                            {blockErrors.medidasPrev && <span className="mt-1 block text-xs text-danger">{blockErrors.medidasPrev}</span>}
                          </label>

                          <label className="block">
                            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Acciones</span>
                            <textarea
                              rows="3"
                              value={item.acciones || ''}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'acciones', e.target.value)}
                              maxLength={2000}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                            />
                            {blockErrors.acciones && <span className="mt-1 block text-xs text-danger">{blockErrors.acciones}</span>}
                          </label>

                          <label className="block">
                            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Recursos</span>
                            <textarea
                              rows="3"
                              value={item.recursos || ''}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'recursos', e.target.value)}
                              maxLength={2000}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                            />
                            {blockErrors.recursos && <span className="mt-1 block text-xs text-danger">{blockErrors.recursos}</span>}
                          </label>

                          <div className="grid gap-3 md:grid-cols-3">
                            <InputField
                              label="Fecha de cumplimiento"
                              type="date"
                              value={item.fechaCumplimiento || ''}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'fechaCumplimiento', e.target.value)}
                              error={blockErrors.fechaCumplimiento}
                            />
                            <label className="block md:col-span-1">
                              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Responsable</span>
                              <textarea
                                rows="2"
                                value={item.responsable || ''}
                                onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'responsable', e.target.value)}
                                maxLength={2000}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                              />
                              {blockErrors.responsable && <span className="mt-1 block text-xs text-danger">{blockErrors.responsable}</span>}
                            </label>
                            <SelectField
                              label="Estado"
                              value={item.estado || 'pendiente'}
                              onChange={(e) => updateRiesgoAsociado(funcionIndex, riskIndex, 'estado', e.target.value)}
                              error={blockErrors.estado}
                              options={[
                                { value: 'pendiente', label: 'Pendiente' },
                                { value: 'en proceso', label: 'En proceso' },
                                { value: 'completado', label: 'Completado' },
                              ]}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </section>
                )}
              </section>
            )
          })}

          <Button type="button" className="gap-2" variant="secondary" onClick={addFuncionBloque} disabled={!values.puestoId}>
            <FiPlus /> Agregar Nueva Función
          </Button>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Observaciones</span>
            <textarea
              name="observaciones"
              rows="2"
              value={values.observaciones}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
            />
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Detalle de evaluación" width="max-w-5xl">
        {!selectedEvaluation ? (
          <div className="py-8 text-sm text-gray-500">{loadingEvaluation ? 'Cargando detalle...' : 'Sin datos'}</div>
        ) : (
          <div className="space-y-4">
            <section className="grid gap-3 md:grid-cols-3">
              {[
                ['Fecha', formatDate(selectedEvaluation.fecha)],
                ['Sub Dirección', selectedEvaluation.subDireccion],
                ['Departamento', selectedEvaluation.departamento],
                ['Servicio', selectedEvaluation.servicio],
                ['Puesto', selectedEvaluation.puesto],
                ['Ubicación física', selectedEvaluation.ubicacion],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 text-xs font-semibold uppercase text-gray-500">{label}</div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium dark:border-gray-700 dark:bg-gray-900/40">{value || '-'}</div>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Funciones y riesgos asociados</h3>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="gap-2" onClick={() => openPrintableWindow(selectedEvaluation)}>
                    <FiPrinter /> Imprimir
                  </Button>
                  <Button type="button" className="gap-2" onClick={() => openPrintableWindow(selectedEvaluation)}>
                    <FiDownload /> Exportar a PDF
                  </Button>
                </div>
              </div>

              {getDisplayFunciones(selectedEvaluation).map((funcion, funcionIndex) => (
                <div key={funcion.id || funcionIndex} className="space-y-3 rounded-lg border border-primary/40 p-3 dark:border-primary/30">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-gray-500">Función #{funcionIndex + 1}</div>
                    <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-gray-700">{funcion.funcion || '-'}</div>
                  </div>

                  {(funcion.riesgosAsociados || []).map((risk, index) => (
                    <div key={risk.id || `${funcionIndex}-${index}`} className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Riesgo #{index + 1}</span>
                        <Badge value={risk.clasificacion} />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {[
                          ['Riesgo', risk.riesgo],
                          ['Peligro', risk.peligro],
                          ['Probabilidad', risk.probabilidad],
                          ['Consecuencia', risk.consecuencia],
                          ['Nivel', risk.nivel],
                          ['Clasificación', risk.clasificacion],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="mb-1 text-xs font-semibold uppercase text-gray-500">{label}</div>
                            <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">{value ?? '-'}</div>
                          </div>
                        ))}
                        <div className="md:col-span-2">
                          <div className="mb-1 text-xs font-semibold uppercase text-gray-500">Medidas preventivas</div>
                          <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">{risk.medidasPrev || '-'}</div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="mb-1 text-xs font-semibold uppercase text-gray-500">Acciones</div>
                          <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">{risk.acciones || '-'}</div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="mb-1 text-xs font-semibold uppercase text-gray-500">Recursos</div>
                          <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">{risk.recursos || '-'}</div>
                        </div>
                        <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
                          {[
                            ['Fecha de cumplimiento', formatDate(risk.fechaCumplimiento)],
                            ['Responsable', risk.responsable],
                            ['Estado', risk.estado],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <div className="mb-1 text-xs font-semibold uppercase text-gray-500">{label}</div>
                              <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">{value || '-'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MatrizPage
