import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import LoadingState from './LoadingState'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'

export default function SkillsChart({ data, loading, error, onRetry }) {
  const chartHeight = Math.max(280, (data?.length ?? 0) * 36 + 48)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Top Requested Skills</h2>
      <p className="mb-4 text-xs text-slate-500">Top 10 skills by job count</p>

      {loading && <LoadingState label="Loading skills..." compact />}
      {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}
      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState message="No skill data available yet." />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="w-full" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="skill"
                width={120}
                tick={{ fill: '#475569', fontSize: 12 }}
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
              <Bar
                dataKey="total_jobs"
                name="Jobs"
                fill="#6366f1"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
