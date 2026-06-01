import { createClient } from '@/lib/supabase/server'
import { StatsCounter } from '@/components/shared/stats-counter'
import { Users, Package, Download, Star } from 'lucide-react'

export async function StatsSection() {
  const supabase = await createClient()

  const [
    { count: resources },
    { count: downloads },
    { count: users },
    { count: testimonials },
  ] = await Promise.all([
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('downloads').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_approved', true),
  ])

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCounter
          title="Premium Resources"
          value={resources || 0}
          icon={<Package className="h-5 w-5" />}
          trend="+12%"
        />
        <StatsCounter
          title="Total Downloads"
          value={downloads || 0}
          icon={<Download className="h-5 w-5" />}
          trend="+8%"
        />
        <StatsCounter
          title="Active Members"
          value={users || 0}
          icon={<Users className="h-5 w-5" />}
          trend="+24%"
        />
        <StatsCounter
          title="5-Star Reviews"
          value={testimonials || 0}
          icon={<Star className="h-5 w-5" />}
          trend="+15%"
        />
      </div>
    </section>
  )
}
