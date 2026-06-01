'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { ArrowLeft, Save, Ban } from 'lucide-react'
import Link from 'next/link'

export default function AdminUserDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { supabase } = useSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
      setUser(data)
      setLoading(false)
    }
    fetchUser()
  }, [id, supabase])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: user.full_name,
        username: user.username,
        role: user.role,
        is_banned: user.is_banned,
        points_balance: user.points_balance,
        affiliate_earnings: user.affiliate_earnings,
      })
      .eq('id', id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Updated', description: 'User updated successfully.', variant: 'success' })
    }
    setSaving(false)
  }

  const handleBanToggle = async () => {
    const newBan = !user.is_banned
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: newBan })
      .eq('id', id)
    if (!error) {
      setUser({ ...user, is_banned: newBan })
      toast({ title: newBan ? 'Banned' : 'Unbanned', variant: 'success' })
    }
  }

  if (loading) return <Skeleton className="h-96 rounded-2xl" />
  if (!user) return <div className="text-center py-20">User not found.</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit User</h1>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>ID: {user.id}</CardDescription>
            </div>
            <Badge variant={user.is_banned ? 'destructive' : 'success'}>
              {user.is_banned ? 'Banned' : 'Active'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={user.full_name || ''} onChange={(e) => setUser({ ...user, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={user.username || ''} onChange={(e) => setUser({ ...user, username: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="opacity-60" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Points Balance</Label>
              <Input type="number" value={user.points_balance} onChange={(e) => setUser({ ...user, points_balance: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Affiliate Earnings</Label>
              <Input type="number" step="0.01" value={user.affiliate_earnings} onChange={(e) => setUser({ ...user, affiliate_earnings: Number(e.target.value) })} />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Ban className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Banned</span></div>
            <Switch checked={user.is_banned} onCheckedChange={handleBanToggle} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Joined</span>
            <span className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Last Login</span>
            <span className="text-sm text-muted-foreground">{user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
        <Button variant="destructive" onClick={handleBanToggle}><Ban className="h-4 w-4 mr-1" /> {user.is_banned ? 'Unban' : 'Ban'} User</Button>
      </div>
    </div>
  )
}
