const HeatmapGrid = ({ data = [], onCellClick }) => {
  const probs = [1, 2, 3, 4, 5]
  const cons = [1, 2, 3, 4, 5]

  const max = data.reduce((acc, item) => Math.max(acc, Number(item.value) || 0), 0)

  const getValue = (prob, consv) => {
    const found = data.find((item) => Number(item.probabilidad) === prob && Number(item.consecuencia) === consv)
    return Number(found?.value || 0)
  }

  const colorByValue = (value) => {
    if (value <= 0) return 'bg-gray-100 dark:bg-gray-700'
    const ratio = max > 0 ? value / max : 0
    if (ratio < 0.25) return 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200'
    if (ratio < 0.5) return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200'
    if (ratio < 0.75) return 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200'
    return 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200'
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="mb-2 grid grid-cols-6 gap-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-300">
          <div />
          {cons.map((c) => (
            <div key={`c-head-${c}`}>C{c}</div>
          ))}
        </div>

        {probs.map((p) => (
          <div key={`p-row-${p}`} className="mb-2 grid grid-cols-6 gap-2">
            <div className="flex items-center justify-center rounded border border-gray-200 bg-gray-50 text-xs font-semibold dark:border-gray-700 dark:bg-gray-900/40">
              P{p}
            </div>
            {cons.map((c) => {
              const value = getValue(p, c)
              return (
                <button
                  type="button"
                  key={`cell-${p}-${c}`}
                  onClick={() => onCellClick?.({ probabilidad: p, consecuencia: c, value })}
                  className={`h-12 rounded border border-gray-200 text-xs font-bold dark:border-gray-700 ${colorByValue(value)}`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeatmapGrid
