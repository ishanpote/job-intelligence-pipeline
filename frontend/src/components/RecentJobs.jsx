import { useMemo, useState } from 'react'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'

const CATEGORIES = ['All', 'Python', 'SQL', 'Other']

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function matchesSearch(job, query) {
  if (!query) return true

  const normalized = query.toLowerCase()
  const fields = [job.job_title, job.location, job.skills, job.category]

  return fields.some((field) =>
    String(field ?? '')
      .toLowerCase()
      .includes(normalized)
  )
}

function CategoryBadge({ category }) {
  const styles = {
    Python: 'bg-blue-50 text-blue-700 ring-blue-100',
    SQL: 'bg-violet-50 text-violet-700 ring-violet-100',
    Other: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  const className = styles[category] ?? 'bg-slate-100 text-slate-700 ring-slate-200'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {category}
    </span>
  )
}

export default function RecentJobs({ jobs, loading, error, onRetry }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredJobs = useMemo(() => {
    return (jobs ?? []).filter((job) => {
      const matchesCategory =
        categoryFilter === 'All' || job.category === categoryFilter
      return matchesCategory && matchesSearch(job, search.trim())
    })
  }, [jobs, search, categoryFilter])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Jobs</h2>
          <p className="mt-1 text-xs text-slate-500">
            Latest 10 records from Supabase, sorted by processed date
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, location, skills..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
              aria-label="Search recent jobs"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <LoadingState label="Loading recent jobs..." compact />}
      {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}
      {!loading && !error && (!jobs || jobs.length === 0) && <EmptyState />}
      {!loading && !error && jobs && jobs.length > 0 && filteredJobs.length === 0 && (
        <EmptyState message="No jobs match your search or filter." />
      )}
      {!loading && !error && filteredJobs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Job Title</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Skills</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Processed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job, index) => (
                <tr
                  key={job.job_id ?? `${job.job_title}-${job.processed_at}-${index}`}
                  className="hover:bg-slate-50"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">{job.job_title}</td>
                  <td className="px-3 py-3 text-slate-600">{job.location}</td>
                  <td className="px-3 py-3 text-slate-600">{job.skills}</td>
                  <td className="px-3 py-3">
                    <CategoryBadge category={job.category} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                    {formatDate(job.processed_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
