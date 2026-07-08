import { format, parseISO, isValid } from 'date-fns'

export const formatDate = (value, pattern = 'dd/MM/yyyy') => {
  if (!value) return '-'

  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return '-'

  return format(date, pattern)
}

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0'
  return new Intl.NumberFormat('es-EC').format(Number(value))
}
