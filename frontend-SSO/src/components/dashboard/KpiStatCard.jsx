const KpiStatCard = ({ title, value, helper }) => {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {helper && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>}
    </article>
  )
}

export default KpiStatCard
