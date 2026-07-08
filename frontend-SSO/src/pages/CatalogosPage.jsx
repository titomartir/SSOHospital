import { useMemo, useState } from 'react'
import Button from '../components/Button'
import InputField from '../components/InputField'
import Badge from '../components/Badge'
import SelectField from '../components/SelectField'
import { useData } from '../context/DataContext'

const CatalogosPage = () => {
  const {
    catalogos,
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
  } = useData()

  const [selectedSubDireccionId, setSelectedSubDireccionId] = useState(null)
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState(null)
  const [selectedServicioId, setSelectedServicioId] = useState(null)
  const [selectedRiesgoId, setSelectedRiesgoId] = useState(null)
  const [selectedPuestoId, setSelectedPuestoId] = useState(null)

  const [nuevaSubDireccion, setNuevaSubDireccion] = useState('')
  const [nuevoDepartamento, setNuevoDepartamento] = useState('')
  const [nuevoServicio, setNuevoServicio] = useState('')
  const [nuevoPeligro, setNuevoPeligro] = useState('')
  const [nuevoRiesgo, setNuevoRiesgo] = useState('')
  const [nuevoPuesto, setNuevoPuesto] = useState('')
  const [nuevaFuncion, setNuevaFuncion] = useState('')

  const [editingSubDireccionId, setEditingSubDireccionId] = useState(null)
  const [editingSubDireccionNombre, setEditingSubDireccionNombre] = useState('')
  const [editingDepartamentoId, setEditingDepartamentoId] = useState(null)
  const [editingDepartamentoNombre, setEditingDepartamentoNombre] = useState('')
  const [editingDepartamentoSubDireccionId, setEditingDepartamentoSubDireccionId] = useState(null)
  const [editingServicioId, setEditingServicioId] = useState(null)
  const [editingServicioNombre, setEditingServicioNombre] = useState('')
  const [editingServicioDepartamentoId, setEditingServicioDepartamentoId] = useState(null)
  const [editingRiesgoId, setEditingRiesgoId] = useState(null)
  const [editingRiesgoNombre, setEditingRiesgoNombre] = useState('')
  const [editingPeligroId, setEditingPeligroId] = useState(null)
  const [editingPeligroNombre, setEditingPeligroNombre] = useState('')
  const [editingPeligroRiesgoId, setEditingPeligroRiesgoId] = useState(null)
  const [editingPuestoId, setEditingPuestoId] = useState(null)
  const [editingPuestoNombre, setEditingPuestoNombre] = useState('')
  const [editingPuestoServicioId, setEditingPuestoServicioId] = useState(null)
  const [editingFuncionId, setEditingFuncionId] = useState(null)
  const [editingFuncionNombre, setEditingFuncionNombre] = useState('')
  const [editingFuncionPuestoId, setEditingFuncionPuestoId] = useState(null)

  const subDirecciones = useMemo(() => catalogos.estructura || [], [catalogos.estructura])
  const selectedSubDireccion = useMemo(
    () => subDirecciones.find((s) => s.id === selectedSubDireccionId) || null,
    [subDirecciones, selectedSubDireccionId]
  )
  const departamentos = useMemo(() => selectedSubDireccion?.departamentos || [], [selectedSubDireccion])
  const allDepartamentos = useMemo(
    () => subDirecciones.flatMap((sd) => sd.departamentos.map((d) => ({ ...d, subDireccionId: sd.id }))),
    [subDirecciones]
  )
  const selectedDepartamento = useMemo(() => {
    if (!selectedDepartamentoId) return null
    return departamentos.find((d) => d.id === selectedDepartamentoId) || null
  }, [departamentos, selectedDepartamentoId])
  const serviciosDelDepartamento = useMemo(() => selectedDepartamento?.servicios || [], [selectedDepartamento])
  const selectedServicio = useMemo(
    () => serviciosDelDepartamento.find((s) => s.id === selectedServicioId) || null,
    [serviciosDelDepartamento, selectedServicioId]
  )
  const puestosDelServicio = useMemo(() => selectedServicio?.puestos || [], [selectedServicio])
  const allServicios = useMemo(
    () => subDirecciones.flatMap((sd) => sd.departamentos.flatMap((d) => d.servicios.map((s) => ({ ...s, departamentoId: d.id })))),
    [subDirecciones]
  )
  const allPuestos = useMemo(
    () => subDirecciones.flatMap((sd) => sd.departamentos.flatMap((d) => d.servicios.flatMap((s) => s.puestos.map((p) => ({ ...p, servicioId: s.id }))))),
    [subDirecciones]
  )

  const riesgoPeligroEstructura = useMemo(
    () => catalogos.riesgoPeligroEstructura || [],
    [catalogos.riesgoPeligroEstructura]
  )
  const selectedRiesgo = useMemo(
    () => riesgoPeligroEstructura.find((r) => r.id === selectedRiesgoId) || null,
    [riesgoPeligroEstructura, selectedRiesgoId]
  )
  const peligrosPorRiesgo = useMemo(() => selectedRiesgo?.peligros || [], [selectedRiesgo])

  const selectedPuesto = useMemo(
    () => puestosDelServicio.find((p) => p.id === selectedPuestoId) || null,
    [puestosDelServicio, selectedPuestoId]
  )
  const funcionesDelPuesto = useMemo(() => selectedPuesto?.funciones || [], [selectedPuesto])

  const onAddSubDireccion = async () => {
    await addSubDireccion(nuevaSubDireccion)
    setNuevaSubDireccion('')
  }

  const onAddDepartamento = async () => {
    if (!selectedSubDireccionId) return
    await addDepartamentoToSubDireccion(nuevoDepartamento, selectedSubDireccionId)
    setNuevoDepartamento('')
  }

  const onAddServicio = async () => {
    if (!selectedDepartamentoId) return
    await addServicio(nuevoServicio, selectedDepartamentoId)
    setNuevoServicio('')
  }

  const onAddRiesgo = async () => {
    await addRiesgo(nuevoRiesgo)
    setNuevoRiesgo('')
  }

  const onAddPeligro = async () => {
    if (!selectedRiesgoId) return
    await addPeligro(nuevoPeligro, selectedRiesgoId)
    setNuevoPeligro('')
  }

  const onAddPuesto = async () => {
    if (!selectedServicioId) return
    await addPuesto(nuevoPuesto, selectedServicioId)
    setNuevoPuesto('')
  }

  const onAddFuncion = async () => {
    if (!selectedPuestoId) return
    await addFuncion(nuevaFuncion, selectedPuestoId)
    setNuevaFuncion('')
  }

  const onSaveRiesgoEdit = async () => {
    await updateRiesgo(editingRiesgoId, editingRiesgoNombre)
    setEditingRiesgoId(null)
    setEditingRiesgoNombre('')
  }

  const onSavePeligroEdit = async () => {
    await updatePeligro(editingPeligroId, editingPeligroNombre, editingPeligroRiesgoId)
    setEditingPeligroId(null)
    setEditingPeligroNombre('')
    setEditingPeligroRiesgoId(null)
  }

  const onSavePuestoEdit = async () => {
    await updatePuesto(editingPuestoId, editingPuestoNombre, editingPuestoServicioId)
    setEditingPuestoId(null)
    setEditingPuestoNombre('')
    setEditingPuestoServicioId(null)
  }

  const onSaveFuncionEdit = async () => {
    await updateFuncion(editingFuncionId, editingFuncionNombre, editingFuncionPuestoId)
    setEditingFuncionId(null)
    setEditingFuncionNombre('')
    setEditingFuncionPuestoId(null)
  }

  const onSaveSubDireccionEdit = async () => {
    await updateSubDireccion(editingSubDireccionId, editingSubDireccionNombre)
    setEditingSubDireccionId(null)
    setEditingSubDireccionNombre('')
  }

  const onSaveDepartamentoEdit = async () => {
    await updateDepartamentoById(editingDepartamentoId, editingDepartamentoNombre, editingDepartamentoSubDireccionId)
    setEditingDepartamentoId(null)
    setEditingDepartamentoNombre('')
    setEditingDepartamentoSubDireccionId(null)
  }

  const onSaveServicioEdit = async () => {
    await updateServicio(editingServicioId, editingServicioNombre, editingServicioDepartamentoId)
    setEditingServicioId(null)
    setEditingServicioNombre('')
    setEditingServicioDepartamentoId(null)
  }

  const onDeleteSubDireccion = async (id) => {
    if (!window.confirm('¿Eliminar sub dirección?')) return
    await removeSubDireccion(id)
    if (selectedSubDireccionId === id) {
      setSelectedSubDireccionId(null)
      setSelectedDepartamentoId(null)
    }
  }

  const onDeleteDepartamento = async (id) => {
    if (!window.confirm('¿Eliminar departamento?')) return
    await removeDepartamentoById(id)
    if (selectedDepartamentoId === id) {
      setSelectedDepartamentoId(null)
    }
  }

  const onDeleteServicio = async (id) => {
    if (!window.confirm('¿Eliminar servicio?')) return
    await removeServicio(id)
    if (selectedServicioId === id) setSelectedServicioId(null)
  }

  const onDeleteRiesgo = async (id) => {
    if (!window.confirm('¿Eliminar riesgo?')) return
    await removeRiesgo(id)
    if (selectedRiesgoId === id) setSelectedRiesgoId(null)
  }

  const onDeletePeligro = async (id) => {
    if (!window.confirm('¿Eliminar peligro?')) return
    await removePeligro(id)
  }

  const onDeletePuesto = async (id) => {
    if (!window.confirm('¿Eliminar puesto?')) return
    await removePuesto(id)
    if (selectedPuestoId === id) setSelectedPuestoId(null)
  }

  const onDeleteFuncion = async (id) => {
    if (!window.confirm('¿Eliminar función?')) return
    await removeFuncion(id)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Sub Direcciones</h2>
          <div className="mb-3 flex gap-2">
            <InputField
              placeholder="Nueva sub dirección"
              value={nuevaSubDireccion}
              onChange={(e) => setNuevaSubDireccion(e.target.value)}
            />
            <Button onClick={onAddSubDireccion}>Agregar</Button>
          </div>
          <div className="space-y-2">
            {subDirecciones.map((subDir) => {
              const isSelected = selectedSubDireccionId === subDir.id
              const isEditing = editingSubDireccionId === subDir.id
              return (
                <div
                  key={subDir.id}
                  className={`rounded-lg border px-3 py-2 ${isSelected ? 'border-primary bg-blue-50 dark:bg-gray-700/40' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <InputField
                        value={editingSubDireccionNombre}
                        onChange={(e) => setEditingSubDireccionNombre(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button className="px-2 py-1 text-xs" onClick={onSaveSubDireccionEdit}>Guardar</Button>
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingSubDireccionId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                        onClick={() => {
                          setSelectedSubDireccionId(subDir.id)
                          setSelectedDepartamentoId(null)
                        }}
                      >
                        {subDir.nombre}
                      </button>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          onClick={() => {
                            setEditingSubDireccionId(subDir.id)
                            setEditingSubDireccionNombre(subDir.nombre)
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeleteSubDireccion(subDir.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Departamentos</h2>
          <div className="mb-3">
            <SelectField
              label="Sub Dirección"
              value={selectedSubDireccionId || ''}
              onChange={(e) => {
                const selectedId = e.target.value ? Number(e.target.value) : null
                setSelectedSubDireccionId(selectedId)
                setSelectedDepartamentoId(null)
              }}
              options={[
                { value: '', label: 'Seleccione una sub dirección' },
                ...subDirecciones.map((sd) => ({ value: sd.id, label: sd.nombre })),
              ]}
            />
          </div>
          <div className="mb-3 flex gap-2">
            <InputField
              placeholder="Nuevo departamento"
              value={nuevoDepartamento}
              onChange={(e) => setNuevoDepartamento(e.target.value)}
              disabled={!selectedSubDireccionId}
            />
            <Button onClick={onAddDepartamento} disabled={!selectedSubDireccionId}>Agregar</Button>
          </div>
          <div className="space-y-2">
            {departamentos.map((dep) => {
              const isSelected = selectedDepartamentoId === dep.id
              const isEditing = editingDepartamentoId === dep.id
              return (
                <div
                  key={dep.id}
                  className={`rounded-lg border px-3 py-2 ${isSelected ? 'border-primary bg-blue-50 dark:bg-gray-700/40' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <InputField
                        value={editingDepartamentoNombre}
                        onChange={(e) => setEditingDepartamentoNombre(e.target.value)}
                      />
                      <SelectField
                        value={editingDepartamentoSubDireccionId || ''}
                        onChange={(e) => setEditingDepartamentoSubDireccionId(Number(e.target.value))}
                        options={subDirecciones.map((sd) => ({ value: sd.id, label: sd.nombre }))}
                      />
                      <div className="flex gap-2">
                        <Button className="px-2 py-1 text-xs" onClick={onSaveDepartamentoEdit}>Guardar</Button>
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingDepartamentoId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                        onClick={() => setSelectedDepartamentoId(dep.id)}
                      >
                        {dep.nombre}
                      </button>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          onClick={() => {
                            setEditingDepartamentoId(dep.id)
                            setEditingDepartamentoNombre(dep.nombre)
                            setEditingDepartamentoSubDireccionId(dep.subDireccionId)
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeleteDepartamento(dep.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Servicios</h2>
          <div className="mb-3">
            <SelectField
              label="Departamento"
              value={selectedDepartamentoId || ''}
              onChange={(e) => setSelectedDepartamentoId(e.target.value ? Number(e.target.value) : null)}
              options={[
                { value: '', label: 'Seleccione un departamento' },
                ...departamentos.map((dep) => ({ value: dep.id, label: dep.nombre })),
              ]}
              disabled={!selectedSubDireccion}
            />
          </div>
          <div className="mb-3 flex gap-2">
            <InputField
              placeholder="Nuevo servicio"
              value={nuevoServicio}
              onChange={(e) => setNuevoServicio(e.target.value)}
              disabled={!selectedDepartamentoId}
            />
            <Button onClick={onAddServicio} disabled={!selectedDepartamentoId}>Agregar</Button>
          </div>
          <div className="space-y-2">
            {serviciosDelDepartamento.map((srv) => {
              const isSelected = selectedServicioId === srv.id
              const isEditing = editingServicioId === srv.id
              return (
                <div key={srv.id} className={`rounded-lg border px-3 py-2 ${isSelected ? 'border-primary bg-blue-50 dark:bg-gray-700/40' : 'border-gray-200 dark:border-gray-700'}`}>
                  {isEditing ? (
                    <div className="space-y-2">
                      <InputField
                        value={editingServicioNombre}
                        onChange={(e) => setEditingServicioNombre(e.target.value)}
                      />
                      <SelectField
                        value={editingServicioDepartamentoId || ''}
                        onChange={(e) => setEditingServicioDepartamentoId(Number(e.target.value))}
                        options={allDepartamentos.map((d) => ({ value: d.id, label: d.nombre }))}
                      />
                      <div className="flex gap-2">
                        <Button className="px-2 py-1 text-xs" onClick={onSaveServicioEdit}>Guardar</Button>
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingServicioId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                        onClick={() => setSelectedServicioId(srv.id)}
                      >
                        {srv.nombre}
                      </button>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          onClick={() => {
                            setEditingServicioId(srv.id)
                            setEditingServicioNombre(srv.nombre)
                            setEditingServicioDepartamentoId(srv.departamentoId)
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeleteServicio(srv.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Puestos</h2>
          <div className="mb-3">
            <SelectField
              label="Servicio"
              value={selectedServicioId || ''}
              onChange={(e) => {
                setSelectedServicioId(e.target.value ? Number(e.target.value) : null)
                setSelectedPuestoId(null)
              }}
              options={[
                { value: '', label: 'Seleccione un servicio' },
                ...serviciosDelDepartamento.map((s) => ({ value: s.id, label: s.nombre })),
              ]}
              disabled={!selectedDepartamento}
            />
          </div>
          <div className="mb-3 flex gap-2">
            <InputField
              placeholder="Nuevo puesto"
              value={nuevoPuesto}
              onChange={(e) => setNuevoPuesto(e.target.value)}
              disabled={!selectedServicioId}
            />
            <Button onClick={onAddPuesto} disabled={!selectedServicioId}>Agregar</Button>
          </div>
          <div className="space-y-2">
            {puestosDelServicio.map((puesto) => {
              const isSelected = selectedPuestoId === puesto.id
              const isEditing = editingPuestoId === puesto.id
              return (
                <div
                  key={puesto.id}
                  className={`rounded-lg border px-3 py-2 ${isSelected ? 'border-primary bg-blue-50 dark:bg-gray-700/40' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <InputField value={editingPuestoNombre} onChange={(e) => setEditingPuestoNombre(e.target.value)} />
                      <SelectField
                        value={editingPuestoServicioId || ''}
                        onChange={(e) => setEditingPuestoServicioId(Number(e.target.value))}
                        options={allServicios.map((s) => ({ value: s.id, label: s.nombre }))}
                      />
                      <div className="flex gap-2">
                        <Button className="px-2 py-1 text-xs" onClick={onSavePuestoEdit}>Guardar</Button>
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingPuestoId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                        onClick={() => setSelectedPuestoId(puesto.id)}
                      >
                        {puesto.nombre}
                      </button>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          onClick={() => {
                            setEditingPuestoId(puesto.id)
                            setEditingPuestoNombre(puesto.nombre)
                            setEditingPuestoServicioId(puesto.servicioId)
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeletePuesto(puesto.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Funciones</h2>
          <div className="mb-3">
            <SelectField
              label="Puesto"
              value={selectedPuestoId || ''}
              onChange={(e) => setSelectedPuestoId(e.target.value ? Number(e.target.value) : null)}
              options={[
                { value: '', label: 'Seleccione un puesto' },
                ...puestosDelServicio.map((p) => ({ value: p.id, label: p.nombre })),
              ]}
              disabled={!selectedServicio}
            />
          </div>
          <div className="flex gap-2">
            <InputField
              placeholder="Nueva función"
              value={nuevaFuncion}
              onChange={(e) => setNuevaFuncion(e.target.value)}
              disabled={!selectedPuestoId}
            />
            <Button onClick={onAddFuncion} disabled={!selectedPuestoId}>Agregar</Button>
          </div>
          <div className="mt-4 space-y-2">
            {funcionesDelPuesto.map((funcion) => {
              const isEditing = editingFuncionId === funcion.id
              return (
                <div key={funcion.id} className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                  {isEditing ? (
                    <div className="space-y-2">
                      <InputField value={editingFuncionNombre} onChange={(e) => setEditingFuncionNombre(e.target.value)} />
                      <SelectField
                        value={editingFuncionPuestoId || ''}
                        onChange={(e) => setEditingFuncionPuestoId(Number(e.target.value))}
                        options={allPuestos.map((p) => ({ value: p.id, label: p.nombre }))}
                      />
                      <div className="flex gap-2">
                        <Button className="px-2 py-1 text-xs" onClick={onSaveFuncionEdit}>Guardar</Button>
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingFuncionId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-200">{funcion.nombre}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          onClick={() => {
                            setEditingFuncionId(funcion.id)
                            setEditingFuncionNombre(funcion.nombre)
                            setEditingFuncionPuestoId(funcion.puestoId)
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeleteFuncion(funcion.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Resumen de estructura</h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
            <span>Sub Direcciones</span>
            <Badge value={subDirecciones.length} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
            <span>Departamentos</span>
            <Badge value={allDepartamentos.length} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
            <span>Servicios</span>
            <Badge value={allServicios.length} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
            <span>Puestos</span>
            <Badge value={allPuestos.length} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Riesgos</h2>
        <div className="flex gap-2">
          <InputField
            placeholder="Nuevo riesgo"
            value={nuevoRiesgo}
            onChange={(e) => setNuevoRiesgo(e.target.value)}
          />
          <Button onClick={onAddRiesgo}>Agregar</Button>
        </div>
        <div className="mt-4 space-y-2">
          {riesgoPeligroEstructura.map((riesgo) => {
            const isSelected = selectedRiesgoId === riesgo.id
            const isEditing = editingRiesgoId === riesgo.id
            return (
            <div
              key={riesgo.id}
              className={`rounded-lg border px-3 py-2 ${isSelected ? 'border-primary bg-blue-50 dark:bg-gray-700/40' : 'border-gray-200 dark:border-gray-700'}`}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <InputField value={editingRiesgoNombre} onChange={(e) => setEditingRiesgoNombre(e.target.value)} />
                  <div className="flex gap-2">
                    <Button className="px-2 py-1 text-xs" onClick={onSaveRiesgoEdit}>Guardar</Button>
                    <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingRiesgoId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="w-full text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                    onClick={() => setSelectedRiesgoId(riesgo.id)}
                  >
                    {riesgo.nombre}
                  </button>
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      onClick={() => {
                        setEditingRiesgoId(riesgo.id)
                        setEditingRiesgoNombre(riesgo.nombre)
                      }}
                    >
                      Editar
                    </Button>
                    <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeleteRiesgo(riesgo.id)}>
                      Eliminar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )})}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Peligros</h2>
        <div className="mb-3">
          <SelectField
            label="Riesgo"
            value={selectedRiesgoId || ''}
            onChange={(e) => setSelectedRiesgoId(e.target.value ? Number(e.target.value) : null)}
            options={[
              { value: '', label: 'Seleccione un riesgo' },
              ...riesgoPeligroEstructura.map((r) => ({ value: r.id, label: r.nombre })),
            ]}
          />
        </div>
        <div className="flex gap-2">
          <InputField
            placeholder="Nuevo peligro"
            value={nuevoPeligro}
            onChange={(e) => setNuevoPeligro(e.target.value)}
            disabled={!selectedRiesgoId}
          />
          <Button onClick={onAddPeligro} disabled={!selectedRiesgoId}>Agregar</Button>
        </div>
        <div className="mt-4 space-y-2">
          {peligrosPorRiesgo.map((peligro) => {
            const isEditing = editingPeligroId === peligro.id
            return (
            <div key={peligro.id} className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
              {isEditing ? (
                <div className="space-y-2">
                  <InputField value={editingPeligroNombre} onChange={(e) => setEditingPeligroNombre(e.target.value)} />
                  <SelectField
                    value={editingPeligroRiesgoId || ''}
                    onChange={(e) => setEditingPeligroRiesgoId(Number(e.target.value))}
                    options={riesgoPeligroEstructura.map((r) => ({ value: r.id, label: r.nombre }))}
                  />
                  <div className="flex gap-2">
                    <Button className="px-2 py-1 text-xs" onClick={onSavePeligroEdit}>Guardar</Button>
                    <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditingPeligroId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{peligro.nombre}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      onClick={() => {
                        setEditingPeligroId(peligro.id)
                        setEditingPeligroNombre(peligro.nombre)
                        setEditingPeligroRiesgoId(peligro.riesgoId)
                      }}
                    >
                      Editar
                    </Button>
                    <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDeletePeligro(peligro.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )})}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Escala de probabilidad</h2>
        <div className="flex flex-wrap gap-2">
          {catalogos.escalasProbabilidad.map((item) => (
            <Badge key={item} value={`Nivel ${item}`} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Clasificaciones de riesgo</h2>
        <div className="space-y-2">
          {catalogos.clasificaciones.map((item) => (
            <div key={item} className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
              <Badge value={item} />
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}

export default CatalogosPage
