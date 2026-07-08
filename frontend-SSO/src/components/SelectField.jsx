const SelectField = ({ label, options = [], error, className = '', ...props }) => {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>}
      <select
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-primary transition focus:border-primary focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${className}`}
        {...props}
      >
        {options.map((option) => {
          const value = typeof option === 'object' ? option.value : option
          const labelValue = typeof option === 'object' ? option.label : option
          return (
            <option key={value} value={value}>
              {labelValue}
            </option>
          )
        })}
      </select>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
}

export default SelectField
