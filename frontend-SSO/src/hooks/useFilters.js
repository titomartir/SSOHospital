import { useMemo, useState } from 'react'

export const useFilters = (data = [], filterFn = (rows) => rows) => {
  const [filters, setFilters] = useState({})

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => setFilters({})

  const filteredData = useMemo(() => filterFn(data, filters), [data, filters, filterFn])

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredData,
  }
}
