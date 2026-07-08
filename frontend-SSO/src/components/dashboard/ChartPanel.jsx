const ChartPanel = ({ title, children, onHeaderClick }) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h2>
        {onHeaderClick && (
          <button
            type="button"
            onClick={onHeaderClick}
            className="text-xs text-primary hover:underline"
          >
            Ver detalle
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export default ChartPanel
