export const required = (value) => value !== undefined && value !== null && String(value).trim() !== ''

export const validateMatrizForm = (values) => {
  const errors = {}
  const MAX_LONG_TEXT = 2000

  const requiredFields = [
    'fecha',
    'subDireccionId',
    'departamentoId',
    'servicioId',
    'puestoId',
    'ubicacion',
  ]

  requiredFields.forEach((field) => {
    if (!required(values[field])) {
      errors[field] = 'Este campo es obligatorio'
    }
  })

  const funciones = Array.isArray(values.funciones)
    ? values.funciones
    : [{ funcionId: values.funcionId, riesgosAsociados: values.riesgosAsociados || [] }]

  if (funciones.length === 0) {
    errors.funciones = 'Debe agregar al menos una función'
  } else {
    const funcionesErrors = funciones.map((funcionBloque) => {
      const functionErrors = {}
      if (!required(funcionBloque.funcionId)) {
        functionErrors.funcionId = 'Seleccione una función'
      }

      const riesgosAsociados = Array.isArray(funcionBloque.riesgosAsociados) ? funcionBloque.riesgosAsociados : []
      if (riesgosAsociados.length === 0) {
        functionErrors.riesgosAsociados = 'Debe agregar al menos un riesgo asociado'
        return functionErrors
      }

      const duplicatedKeys = new Set()
      const seenKeys = new Set()

      const riesgosErrors = riesgosAsociados.map((item) => {
        const rowErrors = {}

        if (!required(item.riesgoId)) rowErrors.riesgoId = 'Seleccione un riesgo'
        if (!required(item.peligroId)) rowErrors.peligroId = 'Seleccione un peligro'
        if (!required(item.probabilidad)) rowErrors.probabilidad = 'Seleccione una probabilidad'
        if (!required(item.consecuencia)) rowErrors.consecuencia = 'Seleccione una consecuencia'
        if (!required(item.medidasPrev)) rowErrors.medidasPrev = 'Ingrese medidas preventivas'
        if (!required(item.acciones)) rowErrors.acciones = 'Ingrese las acciones'
        if (!required(item.recursos)) rowErrors.recursos = 'Ingrese los recursos'
        if (!required(item.fechaCumplimiento)) rowErrors.fechaCumplimiento = 'Ingrese la fecha de cumplimiento'
        if (!required(item.responsable)) rowErrors.responsable = 'Ingrese el responsable'
        if (!required(item.estado)) rowErrors.estado = 'Seleccione un estado'

        if (required(item.medidasPrev) && String(item.medidasPrev).length > MAX_LONG_TEXT) {
          rowErrors.medidasPrev = `Máximo ${MAX_LONG_TEXT} caracteres`
        }
        if (required(item.acciones) && String(item.acciones).length > MAX_LONG_TEXT) {
          rowErrors.acciones = `Máximo ${MAX_LONG_TEXT} caracteres`
        }
        if (required(item.recursos) && String(item.recursos).length > MAX_LONG_TEXT) {
          rowErrors.recursos = `Máximo ${MAX_LONG_TEXT} caracteres`
        }
        if (required(item.responsable) && String(item.responsable).length > MAX_LONG_TEXT) {
          rowErrors.responsable = `Máximo ${MAX_LONG_TEXT} caracteres`
        }

        const pairKey = `${item.riesgoId}-${item.peligroId}`
        if (required(item.riesgoId) && required(item.peligroId)) {
          if (seenKeys.has(pairKey)) {
            duplicatedKeys.add(pairKey)
            rowErrors.peligroId = 'No se permiten pares Riesgo-Peligro duplicados dentro de la misma función'
          } else {
            seenKeys.add(pairKey)
          }
        }

        return rowErrors
      })

      if (duplicatedKeys.size > 0) {
        riesgosErrors.forEach((rowErrors, index) => {
          const item = riesgosAsociados[index]
          const pairKey = `${item.riesgoId}-${item.peligroId}`
          if (duplicatedKeys.has(pairKey)) {
            rowErrors.peligroId = 'No se permiten pares Riesgo-Peligro duplicados dentro de la misma función'
          }
        })
      }

      if (riesgosErrors.some((row) => Object.keys(row).length > 0)) {
        functionErrors.riesgosAsociados = riesgosErrors
      }

      return functionErrors
    })

    if (funcionesErrors.some((row) => Object.keys(row).length > 0)) {
      errors.funciones = funcionesErrors
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
