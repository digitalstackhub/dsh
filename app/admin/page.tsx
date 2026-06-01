import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Package, DollarSign, Activity } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalResources },
    { count: activeSubscriptions },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  const { data: revenueData } = await supabase
    .from('subscriptions')
    .select('amount_paid')
    .eq('status', 'active')
  const totalRevenueAmount = revenueData?.reduce((sum, s) => sum + (s.amount_paid || 0), 0) || 0

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers || 0}</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground">Resources</p>
                <p className="text-2xl font-bold">{totalResources || 0}</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${totalRevenueAmount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
          <Card className="border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <Activity className="h-8 w-8 text-amber-400" />
              <div>
                <p className="text-sm text-muted-foreground">Active Subs</p>
                <p className="text-2xl font-bold">{activeSubscriptions || 0}</p>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-60 rounded-2xl" />}>
        <Card className="border-white/10">
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Points</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers?.map((u: any) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.full_name || 'N/A'}</td>
                    <td className="text-muted-foreground">{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span></td>
                    <td>{u.points_balance}</td>
                    <td className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}
