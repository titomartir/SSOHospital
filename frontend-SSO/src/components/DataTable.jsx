import { useMemo, useState } from 'react'
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi'
import { usePagination } from '../hooks/usePagination'

const DataTable = ({ columns, data, rowKey = 'id', selectable = true }) => {
  const [query, setQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedRows, setSelectedRows] = useState([])

  const filteredData = useMemo(() => {
    if (!query.trim()) return data

    const lower = query.toLowerCase()
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key]
        return String(value ?? '')
          .toLowerCase()
          .includes(lower)
      }),
    )
  }, [columns, data, query])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal === bVal) return 0
      if (sortConfig.direction === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
  }, [filteredData, sortConfig])

  const { page, setPage, totalPages, paginatedData } = usePagination(sortedData, 8)

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
      return
    }
    setSelectedRows(paginatedData.map((item) => item[rowKey]))
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="relative w-full max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
        {selectable && (
          <span className="text-xs text-gray-500 dark:text-gray-300">{selectedRows.length} seleccionadas</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left dark:bg-gray-900/50">
            <tr>
              {selectable && (
                <th className="px-3 py-2">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-200">
                  <button type="button" className="inline-flex items-center gap-1" onClick={() => toggleSort(column.key)}>
                    {column.title}
                    {sortConfig.key === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row[rowKey]} className="border-t border-gray-100 dark:border-gray-700">
                {selectable && (
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row[rowKey])}
                      onChange={() => handleSelectRow(row[rowKey])}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={`${row[rowKey]}-${column.key}`} className="px-3 py-2 text-gray-700 dark:text-gray-200">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 p-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-300">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40 dark:border-gray-600"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40 dark:border-gray-600"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
