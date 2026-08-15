import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'

const CATEGORY_COLORS = {
  Python: '#2563eb',
  SQL: '#7c3aed',
  Other: '#64748b',
}

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] ?? '#0ea5e9'
}

export default function CategoryChart({ data, loading, error, onRetry }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Jobs by Category</h2>

      {loading && <LoadingState label="Loading categories..." compact />}
      {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}
      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState message="No category data available yet." />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                }}
              />
              <Bar dataKey="total_jobs" name="Jobs" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.category} fill={getCategoryColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
