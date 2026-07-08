const InputField = ({ label, error, className = '', ...props }) => {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>}
      <input
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-primary transition focus:border-primary focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
}

export default InputField
