const styles = {
  Bajo: 'bg-success/20 text-success',
  Medio: 'bg-warning/20 text-amber-700',
  Alto: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'Muy alto': 'bg-danger/20 text-danger',
  pendiente: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  'en proceso': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  completado: 'bg-success/20 text-success',
}

const Badge = ({ value }) => {
  const className = styles[value] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {value}
    </span>
  )
}

export default Badge
