import { useMemo, useState } from 'react'

export const usePagination = (data = [], initialPageSize = 10) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize, totalPages])

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return {
    page,
    setPage: goToPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedData,
  }
}
