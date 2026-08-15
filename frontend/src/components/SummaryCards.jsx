import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'

const cards = [
  {
    key: 'total_jobs',
    label: 'Total Jobs',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m0 0h4.125c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9m9 9H9m9 0v4.125c0 .621-.504 1.125-1.125 1.125H9.75M9 5.25v4.125c0 .621-.504 1.125-1.125 1.125H5.25M9 5.25A9 9 0 0118.75 9" />
      </svg>
    ),
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'total_categories',
    label: 'Categories',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    key: 'total_locations',
    label: 'Locations',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    accent: 'bg-emerald-50 text-emerald-600',
  },
]

function formatValue(value) {
  if (value === null || value === undefined) return '—'
  return Number(value).toLocaleString()
}

export default function SummaryCards({ summary, loading, error, onRetry }) {
  if (loading) {
    return (
      <section className="mb-8">
        <LoadingState label="Loading summary..." compact />
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-8">
        <ErrorMessage message={error} onRetry={onRetry} />
      </section>
    )
  }

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-3">
      {cards.map(({ key, label, icon, accent }) => (
        <article
          key={key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {formatValue(summary?.[key])}
              </p>
            </div>
            <div className={`rounded-lg p-2.5 ${accent}`}>{icon}</div>
          </div>
        </article>
      ))}
    </section>
  )
}
