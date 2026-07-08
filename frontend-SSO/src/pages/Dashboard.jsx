import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FiDownload, FiFileText, FiFilter } from 'react-icons/fi'
import Button from '../components/Button'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import KpiStatCard from '../components/dashboard/KpiStatCard'
import ChartPanel from '../components/dashboard/ChartPanel'
import HeatmapGrid from '../components/dashboard/HeatmapGrid'
import { dashboardService } from '../services/dashboardService'

const pieColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const emptyOverview = {
  kpis: {
    totalEvaluaciones: 0,
    totalRiesgosAsociados: 0,
    riesgosMuyAltos: 0,
    riesgosAltos: 0,
    riesgosMedios: 0,
    riesgosBajos: 0,
    accionesPendientes: 0,
    accionesFinalizadas: 0,
    accionesVencidas: 0,
    porcentajeCumplimiento: 0,
    departamentosEvaluados: 0,
    funcionesEvaluadas: 0,
  },
  charts: {
    distribucionClasificacion: [],
    riesgosPorDepartamento: [],
    riesgosPorTipo: [],
    riesgosPorSubdireccion: [],
    evolucionMensual: [],
    riesgosPorPuesto: [],
    cumplimientoAcciones: [],
    estadoRiesgos: [],
    topFunciones: [],
    heatmapProbabilidadConsecuencia: [],
    riesgosPorResponsable: [],
    recursosMasUsados: [],
    riesgosPorUbicacion: [],
    nivelPromedioPorDepartamento: [],
  },
  filterOptions: {
    subDireccion: [],
    departamento: [],
    clasificacion: [],
    estado: [],
    responsable: [],
  },
}

const Dashboard = () => {
  const [overview, setOverview] = useState(emptyOverview)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drilldown, setDrilldown] = useState(null)
  const [filters, setFilters] = useState({
    fechaDesde: '',
    fechaHasta: '',
    subDireccion: '',
    departamento: '',
    clasificacion: '',
    estado: '',
    responsable: '',
  })

  const fetchOverview = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await dashboardService.getOverview(filters)
      setOverview({ ...emptyOverview, ...data })
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('No se pudo cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOverview()
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [
    filters.fechaDesde,
    filters.fechaHasta,
    filters.subDireccion,
    filters.departamento,
    filters.clasificacion,
    filters.estado,
    filters.responsable,
  ])

  const kpiCards = useMemo(
    () => [
      { key: 'totalEvaluaciones', title: 'Total de Evaluaciones', value: overview.kpis.totalEvaluaciones },
      { key: 'totalRiesgosAsociados', title: 'Total de Riesgos Asociados', value: overview.kpis.totalRiesgosAsociados },
      { key: 'riesgosMuyAltos', title: 'Riesgos Muy Altos', value: overview.kpis.riesgosMuyAltos },
      { key: 'riesgosAltos', title: 'Riesgos Altos', value: overview.kpis.riesgosAltos },
      { key: 'riesgosMedios', title: 'Riesgos Medios', value: overview.kpis.riesgosMedios },
      { key: 'riesgosBajos', title: 'Riesgos Bajos', value: overview.kpis.riesgosBajos },
      { key: 'accionesPendientes', title: 'Acciones Pendientes', value: overview.kpis.accionesPendientes },
      { key: 'accionesFinalizadas', title: 'Acciones Finalizadas', value: overview.kpis.accionesFinalizadas },
      { key: 'accionesVencidas', title: 'Acciones Vencidas', value: overview.kpis.accionesVencidas },
      { key: 'porcentajeCumplimiento', title: '% Cumplimiento', value: `${overview.kpis.porcentajeCumplimiento}%` },
      { key: 'departamentosEvaluados', title: 'Departamentos Evaluados', value: overview.kpis.departamentosEvaluados },
      { key: 'funcionesEvaluadas', title: 'Funciones Evaluadas', value: overview.kpis.funcionesEvaluadas },
    ],
    [overview.kpis]
  )

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      fechaDesde: '',
      fechaHasta: '',
      subDireccion: '',
      departamento: '',
      clasificacion: '',
      estado: '',
      responsable: '',
    })
  }

  const exportExcel = () => {
    const lines = []
    lines.push('SECCION,KPI,VALOR')
    kpiCards.forEach((item) => {
      lines.push(`KPIs,${item.title},${item.value}`)
    })

    Object.entries(overview.charts).forEach(([key, rows]) => {
      const normalizedRows = Array.isArray(rows) ? rows : []
      if (normalizedRows.length === 0) return

      const headers = Object.keys(normalizedRows[0] || {})
      if (headers.length === 0) return

      lines.push('')
      lines.push(`DATASET,${key}`)
      lines.push(headers.join(','))

      normalizedRows.forEach((row) => {
        lines.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
      })
    })

    const csvContent = `\uFEFF${lines.join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dashboard-riesgos.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    const root = document.getElementById('dashboard-risk-root')
    if (!root) return

    const cleanupPrintMode = () => {
      document.body.classList.remove('print-dashboard-mode')
      window.removeEventListener('afterprint', cleanupPrintMode)
    }

    try {
      document.body.classList.add('print-dashboard-mode')
      window.addEventListener('afterprint', cleanupPrintMode)
      window.print()

      // Fallback para navegadores que no disparan afterprint de forma confiable.
      window.setTimeout(() => {
        cleanupPrintMode()
      }, 2000)
    } catch (error) {
      cleanupPrintMode()

      const win = window.open('', '_blank', 'width=1200,height=900')
      if (!win) {
        window.alert('No se pudo abrir la impresión. Habilite popups y vuelva a intentar.')
        return
      }

      win.document.open()
      win.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Dashboard de Riesgos</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 16px; color: #111827; }
            h1 { margin: 0 0 12px; font-size: 22px; }
            .print-note { margin-bottom: 14px; color: #4b5563; font-size: 12px; }
            @media print {
              .no-print { display: none !important; }
              body { margin: 8mm; }
              section, article { page-break-inside: avoid; break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Dashboard de Riesgos</h1>
          <div class="print-note">Exportado con filtros actuales</div>
          ${root.innerHTML}
        </body>
        </html>
      `)
      win.document.close()
      win.focus()
      win.onload = () => win.print()
    }
  }

  const donutChart = (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={overview.charts.distribucionClasificacion}
          dataKey="value"
          nameKey="name"
          innerRadius={65}
          outerRadius={100}
          onClick={(data) => setDrilldown({ title: 'Clasificación', ...data })}
        >
          {overview.charts.distribucionClasificacion.map((entry, index) => (
            <Cell key={`${entry.name}-${entry.value}`} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )

  const hasValues = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return false
    return items.some((item) => {
      const value = Number(item?.value)
      return Number.isFinite(value) ? value > 0 : true
    })
  }

  const visibleCharts = {
    distribucionClasificacion: hasValues(overview.charts.distribucionClasificacion),
    riesgosPorTipo: hasValues(overview.charts.riesgosPorTipo),
    riesgosPorDepartamento: hasValues(overview.charts.riesgosPorDepartamento),
    riesgosPorSubdireccion: hasValues(overview.charts.riesgosPorSubdireccion),
    evolucionMensual: hasValues(overview.charts.evolucionMensual),
    riesgosPorPuesto: hasValues(overview.charts.riesgosPorPuesto),
    cumplimientoAcciones: hasValues(overview.charts.cumplimientoAcciones),
    estadoRiesgos: hasValues(overview.charts.estadoRiesgos),
    topFunciones: hasValues(overview.charts.topFunciones),
    heatmapProbabilidadConsecuencia: hasValues(overview.charts.heatmapProbabilidadConsecuencia),
    riesgosPorResponsable: hasValues(overview.charts.riesgosPorResponsable),
    recursosMasUsados: hasValues(overview.charts.recursosMasUsados),
    riesgosPorUbicacion: hasValues(overview.charts.riesgosPorUbicacion),
    nivelPromedioPorDepartamento: hasValues(overview.charts.nivelPromedioPorDepartamento),
  }

  const hasAnyChart = Object.values(visibleCharts).some(Boolean)

  if (loading && !overview) {
    return <div className="text-sm text-gray-500">Cargando dashboard...</div>
  }

  return (
    <div className="space-y-6" id="dashboard-risk-root">
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Ejecutivo de Riesgos</h2>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" className="gap-2" onClick={clearFilters}>
              <FiFilter /> Limpiar filtros
            </Button>
            <Button type="button" variant="secondary" className="gap-2" onClick={exportPdf}>
              <FiFileText /> Exportar PDF
            </Button>
            <Button type="button" className="gap-2" onClick={exportExcel}>
              <FiDownload /> Exportar CSV
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          <InputField label="Fecha desde" type="date" value={filters.fechaDesde} onChange={(e) => updateFilter('fechaDesde', e.target.value)} />
          <InputField label="Fecha hasta" type="date" value={filters.fechaHasta} onChange={(e) => updateFilter('fechaHasta', e.target.value)} />
          <SelectField
            label="Subdirección"
            value={filters.subDireccion}
            onChange={(e) => updateFilter('subDireccion', e.target.value)}
            options={[{ value: '', label: 'Todas' }, ...(overview.filterOptions.subDireccion || []).map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Departamento"
            value={filters.departamento}
            onChange={(e) => updateFilter('departamento', e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...(overview.filterOptions.departamento || []).map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Clasificación"
            value={filters.clasificacion}
            onChange={(e) => updateFilter('clasificacion', e.target.value)}
            options={[{ value: '', label: 'Todas' }, ...(overview.filterOptions.clasificacion || []).map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Estado"
            value={filters.estado}
            onChange={(e) => updateFilter('estado', e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...(overview.filterOptions.estado || []).map((item) => ({ value: item, label: item }))]}
          />
          <SelectField
            label="Responsable"
            value={filters.responsable}
            onChange={(e) => updateFilter('responsable', e.target.value)}
            options={[{ value: '', label: 'Todos' }, ...(overview.filterOptions.responsable || []).map((item) => ({ value: item, label: item }))]}
          />
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <KpiStatCard key={kpi.key} title={kpi.title} value={kpi.value} />
        ))}
      </section>

      {drilldown && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
          Detalle seleccionado: <strong>{drilldown.name || '-'}</strong> con valor <strong>{drilldown.value ?? '-'}</strong>
        </div>
      )}

      {hasAnyChart ? (
      <section className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.distribucionClasificacion && (
        <ChartPanel title="Distribución de Riesgos por Clasificación (Dona)">
          <div className="h-80">{donutChart}</div>
        </ChartPanel>
        )}

        {visibleCharts.riesgosPorTipo && (
        <ChartPanel title="Riesgos por Tipo de Riesgo (Barras Verticales)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.riesgosPorTipo} onClick={(d) => d?.activePayload?.[0]?.payload && setDrilldown({ title: 'Tipo de Riesgo', ...d.activePayload[0].payload })}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.riesgosPorDepartamento && (
        <ChartPanel title="Riesgos por Departamento (Barras Horizontales)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.riesgosPorDepartamento} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} onClick={(payload) => setDrilldown({ title: 'Departamento', ...payload })} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.riesgosPorSubdireccion && (
        <ChartPanel title="Riesgos por Subdirección (Barras)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.riesgosPorSubdireccion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} onClick={(payload) => setDrilldown({ title: 'Subdirección', ...payload })} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.evolucionMensual && (
        <ChartPanel title="Evolución Mensual de Evaluaciones (Línea)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview.charts.evolucionMensual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.riesgosPorPuesto && (
        <ChartPanel title="Riesgos por Puesto (Barras)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.riesgosPorPuesto}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.cumplimientoAcciones && (
        <ChartPanel title="Cumplimiento de Acciones Correctivas (Pastel)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview.charts.cumplimientoAcciones} dataKey="value" nameKey="name" outerRadius={100} onClick={(d) => setDrilldown({ title: 'Cumplimiento', ...d })}>
                  {(overview.charts.cumplimientoAcciones || []).map((entry, index) => (
                    <Cell key={`${entry.name}-${entry.value}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.estadoRiesgos && (
        <ChartPanel title="Estado de los Riesgos (Pastel)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={overview.charts.estadoRiesgos} dataKey="value" nameKey="name" outerRadius={100}>
                  {(overview.charts.estadoRiesgos || []).map((entry, index) => (
                    <Cell key={`${entry.name}-${entry.value}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.topFunciones && (
        <ChartPanel title="Top 10 Funciones con Mayor Cantidad de Riesgos (Barras Horizontales)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.topFunciones} layout="vertical" margin={{ left: 35 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.heatmapProbabilidadConsecuencia && (
        <ChartPanel title="HeatMap Probabilidad vs Consecuencia">
          <HeatmapGrid data={overview.charts.heatmapProbabilidadConsecuencia} onCellClick={(cell) => setDrilldown({ title: 'HeatMap', ...cell })} />
        </ChartPanel>
        )}

        {visibleCharts.riesgosPorResponsable && (
        <ChartPanel title="Riesgos por Responsable (Barras)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.riesgosPorResponsable}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.recursosMasUsados && (
        <ChartPanel title="Recursos Preventivos más Utilizados (Barras)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.recursosMasUsados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.riesgosPorUbicacion && (
        <ChartPanel title="Riesgos por Ubicación Física (Barras)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.riesgosPorUbicacion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}

        {visibleCharts.nivelPromedioPorDepartamento && (
        <ChartPanel title="Nivel Promedio de Riesgo por Departamento (Barras)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.nivelPromedioPorDepartamento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        )}
      </section>
      ) : (
        <section className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          No hay datos suficientes para generar gráficas con los filtros actuales.
        </section>
      )}
    </div>
  )
}

export default Dashboard
