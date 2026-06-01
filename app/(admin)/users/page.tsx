import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Search, MoreHorizontal, Ban, CheckCircle } from 'lucide-react'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { search?: string }
}) {
  const supabase = await createClient()
  const search = searchParams?.search || ''

  let query = supabase.from('profiles').select('*')
  if (search) {
    query = query.or(email.ilike.%%,full_name.ilike.%%)
  }
  const { data: users } = await query.order('created_at', { ascending: false }).limit(50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all users.</p>
        </div>
        <form className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input name="search" placeholder="Search users..." defaultValue={search} className="pl-10" />
        </form>
      </div>

      <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
        <Card className="border-white/10">
          <CardContent className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Points</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any) => (
                  <tr key={user.id}>
                    <td className="font-medium">{user.full_name || 'N/A'}</td>
                    <td className="text-muted-foreground">{user.email}</td>
                    <td>
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'info'}>{user.role}</Badge>
                    </td>
                    <td>
                      <Badge variant={user.is_banned ? 'destructive' : 'success'}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </Badge>
                    </td>
                    <td>{user.points_balance}</td>
                    <td className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link href={/admin/users/}>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
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
