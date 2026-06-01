import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Crown, Calendar, ArrowRight, Check } from 'lucide-react'

export default async function MembershipPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plans(name, slug, color, download_limit)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  const currentPlan = subscription?.plans
  const isTrialActive = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Membership</h1>
        <p className="text-muted-foreground">Manage your subscription and plan.</p>
      </div>

      <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
        <Card className="border-white/10 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{currentPlan?.name || 'Free'}</CardTitle>
                  <CardDescription>
                    {isTrialActive
                      ? `Trial active until ${new Date(profile.trial_ends_at!).toLocaleDateString()}`
                      : subscription
                      ? `Renews ${subscription.auto_renew ? 'automatically' : 'manually'}`
                      : 'No active subscription'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={isTrialActive ? 'warning' : subscription ? 'success' : 'secondary'}>
                {isTrialActive ? 'Trial' : subscription ? 'Active' : 'Free'}
              </Badge>
            </div>
          </CardHeader>
          {isTrialActive && (
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-amber-400 mb-2">
                <Calendar className="h-4 w-4" />
                {Math.max(0, Math.ceil((new Date(profile.trial_ends_at!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining
              </div>
              <Progress
                value={
                  ((Date.now() - new Date(profile.trial_started_at!).getTime()) /
                    (new Date(profile.trial_ends_at!).getTime() - new Date(profile.trial_started_at!).getTime())) *
                  100
                }
                className="h-2"
              />
            </CardContent>
          )}
        </Card>
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-3 gap-6"><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></div>}>
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans?.map((plan: any) => (
              <Card
                key={plan.id}
                className={`border-white/10 h-full flex flex-col ${
                  (currentPlan?.slug === plan.slug || (!subscription && plan.slug === 'free'))
                    ? 'border-primary/30 shadow-glow'
                    : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.popular_badge && <Badge variant="success">Popular</Badge>}
                  </CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}`}
                    {plan.price_monthly > 0 && <span className="text-sm text-muted-foreground">/mo</span>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    {plan.features?.map((f: any, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className={`h-4 w-4 ${f.included ? 'text-emerald-400' : 'text-muted-foreground/30'}`} />
                        <span className={f.included ? '' : 'text-muted-foreground/50 line-through'}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  {currentPlan?.slug === plan.slug || (!subscription && plan.slug === 'free') ? (
                    <Button className="w-full" disabled variant="outline">
                      Current Plan
                    </Button>
                  ) : (
                    <Link href={`/checkout?plan=${plan.id}`}>
                      <Button className="w-full">
                        {plan.slug === 'free' ? 'Downgrade' : 'Upgrade'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  )
}
