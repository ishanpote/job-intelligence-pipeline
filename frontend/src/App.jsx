import { useCallback, useEffect, useState } from 'react'
import DashboardHeader from './components/DashboardHeader'
import SummaryCards from './components/SummaryCards'
import CategoryChart from './components/CategoryChart'
import LocationChart from './components/LocationChart'
import SkillsChart from './components/SkillsChart'
import RecentJobs from './components/RecentJobs'
import {
  getJobSummary,
  getJobsByCategory,
  getJobsByLocation,
  getJobsBySkill,
  getRecentJobs,
} from './services/jobService'

function createSectionState() {
  return { data: null, loading: true, error: null }
}

export default function App() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [summary, setSummary] = useState(createSectionState)
  const [categories, setCategories] = useState(createSectionState)
  const [locations, setLocations] = useState(createSectionState)
  const [skills, setSkills] = useState(createSectionState)
  const [recentJobs, setRecentJobs] = useState(createSectionState)

  const loadDashboard = useCallback(async () => {
    setIsRefreshing(true)

    setSummary((prev) => ({ ...prev, loading: true, error: null }))
    setCategories((prev) => ({ ...prev, loading: true, error: null }))
    setLocations((prev) => ({ ...prev, loading: true, error: null }))
    setSkills((prev) => ({ ...prev, loading: true, error: null }))
    setRecentJobs((prev) => ({ ...prev, loading: true, error: null }))

    const results = await Promise.allSettled([
      getJobSummary(),
      getJobsByCategory(),
      getJobsByLocation(),
      getJobsBySkill(),
      getRecentJobs(),
    ])

    const [summaryResult, categoryResult, locationResult, skillResult, jobsResult] = results

    setSummary({
      data: summaryResult.status === 'fulfilled' ? summaryResult.value : null,
      loading: false,
      error: summaryResult.status === 'rejected' ? summaryResult.reason.message : null,
    })

    setCategories({
      data: categoryResult.status === 'fulfilled' ? categoryResult.value : null,
      loading: false,
      error: categoryResult.status === 'rejected' ? categoryResult.reason.message : null,
    })

    setLocations({
      data: locationResult.status === 'fulfilled' ? locationResult.value : null,
      loading: false,
      error: locationResult.status === 'rejected' ? locationResult.reason.message : null,
    })

    setSkills({
      data: skillResult.status === 'fulfilled' ? skillResult.value : null,
      loading: false,
      error: skillResult.status === 'rejected' ? skillResult.reason.message : null,
    })

    setRecentJobs({
      data: jobsResult.status === 'fulfilled' ? jobsResult.value : null,
      loading: false,
      error: jobsResult.status === 'rejected' ? jobsResult.reason.message : null,
    })

    setIsRefreshing(false)
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const missingEnv =
    !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader onRefresh={loadDashboard} isRefreshing={isRefreshing} />

        {missingEnv && (
          <div
            className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            role="alert"
          >
            <p className="font-medium">Supabase configuration required</p>
            <p className="mt-1">
              Copy <code className="rounded bg-amber-100 px-1">.env.example</code> to{' '}
              <code className="rounded bg-amber-100 px-1">.env</code> and set your Supabase URL
              and publishable key.
            </p>
          </div>
        )}

        <SummaryCards
          summary={summary.data}
          loading={summary.loading}
          error={summary.error}
          onRetry={loadDashboard}
        />

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <CategoryChart
            data={categories.data}
            loading={categories.loading}
            error={categories.error}
            onRetry={loadDashboard}
          />
          <LocationChart
            data={locations.data}
            loading={locations.loading}
            error={locations.error}
            onRetry={loadDashboard}
          />
        </div>

        <div className="mb-8">
          <SkillsChart
            data={skills.data}
            loading={skills.loading}
            error={skills.error}
            onRetry={loadDashboard}
          />
        </div>

        <RecentJobs
          jobs={recentJobs.data}
          loading={recentJobs.loading}
          error={recentJobs.error}
          onRetry={loadDashboard}
        />

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          Job Intelligence Dashboard · Data sourced from Supabase PostgreSQL views
        </footer>
      </div>
    </div>
  )
}
