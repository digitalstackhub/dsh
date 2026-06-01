import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Gift, ArrowUp, Check } from 'lucide-react'

export default async function PointsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('points_balance, total_points_earned')
    .eq('id', user.id)
    .single()

  // Fetch levels
  const { data: levels } = await supabase
    .from('levels')
    .select('*')
    .order('min_points', { ascending: true })

  // Fetch points rules
  const { data: rules } = await supabase
    .from('points_rules')
    .select('*')
    .eq('is_active', true)

  // Determine current level
  const points = profile?.points_balance || 0
  const currentLevel = levels?.find(
    (l: any) => points >= l.min_points && (l.max_points === null || points <= l.max_points)
  )
  const nextLevel = levels?.find((l: any) => l.min_points > points)

  const progress = nextLevel
    ? Math.round(((points - (currentLevel?.min_points || 0)) / (nextLevel.min_points - (currentLevel?.min_points || 0))) * 100)
    : 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Points & Rewards</h1>
        <p className="text-muted-foreground">Earn points and unlock rewards.</p>
      </div>

      <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
        <Card className="border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px]" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentLevel?.level_name || 'Bronze'} Level</h3>
                  <p className="text-sm text-muted-foreground">{points.toLocaleString()} points</p>
                </div>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: currentLevel?.color + '20' || '#6366F120' }}
              >
                {currentLevel?.badge_icon === 'Crown' ? '👑' : '⭐'}
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to {nextLevel?.level_name || 'Max'}</span>
                <span>{nextLevel ? ${(nextLevel.min_points - points).toLocaleString()} pts needed : 'Max level!'}</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle>Levels & Perks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {levels?.map((level: any, i: number) => (
                <div
                  key={level.id}
                  className={lex items-center gap-4 p-3 rounded-xl border }
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: level.color + '20', color: level.color }}>
                    {level.badge_icon === 'Crown' ? '👑' : level.badge_icon === 'Trophy' ? '🏆' : '⭐'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{level.level_name}</p>
                      <span className="text-xs text-muted-foreground">
                        {level.min_points.toLocaleString()} – {level.max_points?.toLocaleString() || '∞'} pts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {level.perks?.map((perk: string, j: number) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                  {level.id === currentLevel?.id && (
                    <Badge variant="success" className="text-xs">Current</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules?.map((rule: any) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-xl border border-white/5">
                    <div>
                      <p className="text-sm font-medium">{rule.action_name}</p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                    <Badge variant="info">+{rule.points_amount} pts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}
