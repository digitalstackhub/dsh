import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, DollarSign, Users, TrendingUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AffiliatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, affiliate_earnings, affiliate_paid')
    .eq('id', user.id)
    .single()

  const { data: settings } = await supabase
    .from('affiliate_settings')
    .select('commission_percentage, cookie_days, min_payout')
    .eq('is_active', true)
    .single()

  const { count: referralCount } = await supabase
    .from('affiliate_referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', user.id)

  const { data: referrals } = await supabase
    .from('affiliate_referrals')
    .select('id, commission_earned, status, created_at, referred:profiles!referred_id(full_name, email)')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const referralLink = `${appUrl}/register?ref=${profile?.referral_code}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Affiliate Program</h1>
        <p className="text-muted-foreground">Invite friends and earn commissions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">${(profile?.affiliate_earnings || 0).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Referrals</p>
                <p className="text-2xl font-bold">{referralCount || 0}</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-2xl font-bold">{settings?.commission_percentage || 30}%</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn {settings?.commission_percentage || 30}% commission for {settings?.cookie_days || 30} days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-dark-900 rounded-xl px-4 py-3 text-sm border border-white/10 truncate">
              {referralLink}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(referralLink)
              }}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            {!referrals?.length ? (
              <p className="text-muted-foreground text-sm text-center py-8">No referrals yet. Share your link to start earning.</p>
            ) : (
              <div className="space-y-3">
                {referrals.map((ref: any) => (
                  <div key={ref.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-xl border border-white/5">
                    <div>
                      <p className="text-sm font-medium">{ref.referred?.full_name || ref.referred?.email || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ref.created_at).toLocaleDateString()} · {ref.status}
                      </p>
                    </div>
                    <Badge variant="success">${ref.commission_earned?.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Suspense>

      <div className="text-center">
        <Link href="/dashboard/affiliate/faq">
          <Button variant="link">
            <HelpCircle className="h-4 w-4 mr-1" /> How does the affiliate program work?
          </Button>
        </Link>
      </div>
    </div>
  )
}
