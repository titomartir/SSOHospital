import { useState } from 'react'

export const useForm = (initialValues, validate) => {
  const [values, setValuesState] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const setValues = (nextValues) => {
    setValuesState((prev) => (typeof nextValues === 'function' ? nextValues(prev) : nextValues))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValuesState((prev) => ({ ...prev, [name]: value }))
  }

  const setFieldValue = (name, value) => {
    setValuesState((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = (nextValues = initialValues) => {
    setValuesState(nextValues)
    setErrors({})
  }

  const handleSubmit = (onValidSubmit) => (event) => {
    event.preventDefault()

    if (!validate) {
      onValidSubmit(values)
      return
    }

    const result = validate(values)
    setErrors(result.errors || {})

    if (result.isValid) onValidSubmit(values)
  }

  return {
    values,
    errors,
    setValues,
    setFieldValue,
    setErrors,
    handleChange,
    handleSubmit,
    resetForm,
  }
}
