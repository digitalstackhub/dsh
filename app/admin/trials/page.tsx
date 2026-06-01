'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'

export default function AdminTrialsPage() {
  const { supabase } = useSupabase()
  const [trials, setTrials] = useState<any[]>([])

  const fetchTrials = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .not('trial_ends_at', 'is', null)
      .order('trial_ends_at', { ascending: true })
    setTrials(data || [])
  }

  useEffect(() => { fetchTrials() }, [])

  const extendTrial = async (userId: string, days: number) => {
    const { data: profile } = await supabase.from('profiles').select('trial_ends_at').eq('id', userId).single()
    const currentEnd = new Date(profile?.trial_ends_at || Date.now())
    currentEnd.setDate(currentEnd.getDate() + days)
    await supabase.from('profiles').update({ trial_ends_at: currentEnd.toISOString() }).eq('id', userId)
    toast({ title: 'Trial extended', variant: 'success' })
    fetchTrials()
  }

  const cancelTrial = async (userId: string) => {
    await supabase.from('profiles').update({ trial_ends_at: null }).eq('id', userId)
    toast({ title: 'Trial cancelled', variant: 'success' })
    fetchTrials()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trials</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Trial Ends</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trials.map((t) => {
                const ends = new Date(t.trial_ends_at)
                const active = ends > new Date()
                return (
                  <tr key={t.id}>
                    <td className="font-medium">{t.full_name || 'N/A'}</td>
                    <td className="text-muted-foreground">{t.email}</td>
                    <td>{ends.toLocaleDateString()}</td>
                    <td><Badge variant={active ? 'success' : 'secondary'}>{active ? 'Active' : 'Expired'}</Badge></td>
                    <td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => extendTrial(t.id, 7)}>+7 days</Button>
                        <Button size="sm" variant="destructive" onClick={() => cancelTrial(t.id)}>Cancel</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
