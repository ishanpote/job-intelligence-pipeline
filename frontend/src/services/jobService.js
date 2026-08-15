import { supabase } from '../lib/supabase'

function formatSupabaseError(error) {
  if (!error) return 'An unexpected error occurred.'
  return error.message || 'Unable to load data from Supabase.'
}

async function querySingleRow(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').maybeSingle()

  if (error) {
    throw new Error(formatSupabaseError(error))
  }

  return data
}

async function queryRows(tableName, options = {}) {
  const { orderBy, ascending = true, limit } = options
  let query = supabase.from(tableName).select('*')

  if (orderBy) {
    query = query.order(orderBy, { ascending })
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(formatSupabaseError(error))
  }

  return data ?? []
}

export async function getJobSummary() {
  return querySingleRow('job_summary')
}

export async function getJobsByCategory() {
  return queryRows('jobs_by_category', { orderBy: 'total_jobs', ascending: false })
}

export async function getJobsByLocation() {
  return queryRows('jobs_by_location', { orderBy: 'total_jobs', ascending: false })
}

export async function getJobsBySkill() {
  const rows = await queryRows('jobs_by_skill', {
    orderBy: 'total_jobs',
    ascending: false,
  })

  return rows.slice(0, 10)
}

export async function getRecentJobs() {
  return queryRows('jobs', {
    orderBy: 'processed_at',
    ascending: false,
    limit: 10,
  })
}
