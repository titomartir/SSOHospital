import { useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'
import Badge from '../components/Badge'
import { useData } from '../context/DataContext'
import { useForm } from '../hooks/useForm'
import { formatDate } from '../utils/formatters'

const initialPlan = {
  evaluacionId: '',
  medida: '',
  fechaCumplimiento: '',
  responsable: '',
  estado: 'pendiente',
}

const PlanificacionPage = () => {
  const { matriz, planificaciones, createPlanificacion, updatePlanificacion, deletePlanificacion } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { values, handleChange, handleSubmit, setValues, resetForm } = useForm(initialPlan)

  const onSubmit = async (formValues) => {
    if (editing) {
      await updatePlanificacion(editing.id, formValues)
    } else {
      await createPlanificacion(formValues)
    }
    setModalOpen(false)
    setEditing(null)
    resetForm(initialPlan)
  }

  const onDelete = async (row) => {
    if (!window.confirm(`¿Eliminar la planificación "${row.medida}"?`)) return
    await deletePlanificacion(row.id)
  }

  const columns = [
    {
      key: 'evaluacionId',
      title: 'Evaluación vinculada',
      render: (value) => {
        const match = matriz.find((m) => m.id === Number(value))
        return match ? `${match.departamento} - ${match.puesto}` : 'Sin vínculo'
      },
    },
    { key: 'medida', title: 'Medida preventiva' },
    { key: 'fechaCumplimiento', title: 'Fecha cumplimiento', render: (value) => formatDate(value) },
    { key: 'responsable', title: 'Responsable' },
    { key: 'estado', title: 'Estado', render: (value) => <Badge value={value} /> },
    {
      key: 'action',
      title: 'Acción',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(row)
              setValues(row)
              setModalOpen(true)
            }}
            className="text-primary"
          >
            Editar
          </button>
          <button type="button" onClick={() => onDelete(row)} className="text-danger" title="Eliminar">
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="gap-2"
          onClick={() => {
            setEditing(null)
            resetForm(initialPlan)
            setModalOpen(true)
          }}
        >
          <FiPlus /> Nueva planificación
        </Button>
      </div>

      <DataTable columns={columns} data={planificaciones} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Seguimiento preventivo" width="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <SelectField
            label="Evaluación de riesgo"
            name="evaluacionId"
            value={values.evaluacionId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Seleccione evaluación' },
              ...matriz.map((item) => ({
                value: item.id,
                label: `${item.departamento} | ${item.puesto}`,
              })),
            ]}
          />
          <InputField label="Medida preventiva" name="medida" value={values.medida} onChange={handleChange} />
          <InputField
            label="Fecha de cumplimiento"
            type="date"
            name="fechaCumplimiento"
            value={values.fechaCumplimiento}
            onChange={handleChange}
          />
          <InputField label="Responsable" name="responsable" value={values.responsable} onChange={handleChange} />
          <SelectField
            label="Estado"
            name="estado"
            value={values.estado}
            onChange={handleChange}
            options={[
              { value: 'pendiente', label: 'pendiente' },
              { value: 'en proceso', label: 'en proceso' },
              { value: 'completado', label: 'completado' },
            ]}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PlanificacionPage
