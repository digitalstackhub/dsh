import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { getSetting } from '@/lib/database/settings'
import { StatsCounter } from '@/components/shared/stats-counter'
import { AnnouncementBanner } from '@/components/shared/announcement-banner'
import { ActivityFeed } from '@/components/shared/activity-feed'
import { TrialCountdown } from '@/components/shared/trial-countdown'
import { PointsCard } from '@/components/shared/points-card'
import Link from 'next/link'
import { Download, Users, Package, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch database counts for stats cards
  const [
    { count: totalResources },
    { count: totalDownloads },
    { count: totalUsers },
    { count: activeTrials },
  ] = await Promise.all([
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('downloads').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('trial_ends_at', new Date().toISOString()),
  ])

  // Fetch active announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false })

  // Fetch recent activities
  const { data: activities } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch user's current level
  const { data: levels } = await supabase
    .from('levels')
    .select('*')
    .order('min_points', { ascending: true })

  const currentLevel = levels?.find(
    (l: any) =>
      (profile?.points_balance || 0) >= l.min_points &&
      (l.max_points === null || (profile?.points_balance || 0) <= l.max_points)
  )

  const nextLevel = levels?.find(
    (l: any) => l.min_points > (profile?.points_balance || 0)
  )

  return (
    <div className="space-y-8">
      {/* Announcements */}
      {announcements?.map((a: any) => (
        <AnnouncementBanner key={a.id} announcement={a} />
      ))}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCounter
          title="Total Resources"
          value={totalResources || 0}
          icon={<Package className="h-5 w-5" />}
          trend="+12%"
        />
        <StatsCounter
          title="Total Downloads"
          value={totalDownloads || 0}
          icon={<Download className="h-5 w-5" />}
          trend="+8%"
        />
        <StatsCounter
          title="Active Users"
          value={totalUsers || 0}
          icon={<Users className="h-5 w-5" />}
          trend="+24%"
        />
        <StatsCounter
          title="Active Trials"
          value={activeTrials || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+5%"
        />
      </div>

      {/* Trial countdown + Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
          <TrialCountdown trialEndsAt={profile?.trial_ends_at} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
          <PointsCard
            points={profile?.points_balance || 0}
            totalPoints={profile?.total_points_earned || 0}
            currentLevel={currentLevel}
            nextLevel={nextLevel}
          />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/dashboard/downloads">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Download className="h-4 w-4" /> My Downloads
          </Button>
        </Link>
        <Link href="/resources">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Package className="h-4 w-4" /> Browse Resources
          </Button>
        </Link>
        <Link href="/dashboard/affiliate">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Users className="h-4 w-4" /> Affiliate
          </Button>
        </Link>
        <Link href="/dashboard/points">
          <Button variant="outline" className="w-full justify-start gap-2">
            <TrendingUp className="h-4 w-4" /> Earn Points
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
        <ActivityFeed activities={activities || []} />
      </Suspense>
    </div>
  )
}
