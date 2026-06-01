'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Edit } from 'lucide-react'

export default function AdminPointsRulesPage() {
  const { supabase } = useSupabase()
  const [rules, setRules] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('points_rules').select('*').order('created_at')
    setRules(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (rule: any) => {
    if (rule.id) {
      await supabase.from('points_rules').update(rule).eq('id', rule.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('points_rules').insert(rule)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Points Rules</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Points</th>
                <th>Daily Limit</th>
                <th>Cooldown (hrs)</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.action_name}</td>
                  <td>{r.points_amount}</td>
                  <td>{r.daily_limit}</td>
                  <td>{r.cooldown_hours}</td>
                  <td><Switch checked={r.is_active} disabled /></td>
                  <td>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(r); setDialogOpen(true) }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Points Rule</DialogTitle>
          </DialogHeader>
          <RuleForm rule={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RuleForm({ rule, onSave }: any) {
  const [form, setForm] = useState({ ...rule })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Points Amount</Label>
        <Input type="number" value={form.points_amount} onChange={(e) => setForm({ ...form, points_amount: Number(e.target.value) })} />
      </div>
      <div className="space-y-2">
        <Label>Daily Limit</Label>
        <Input type="number" value={form.daily_limit} onChange={(e) => setForm({ ...form, daily_limit: Number(e.target.value) })} />
      </div>
      <div className="space-y-2">
        <Label>Cooldown Hours</Label>
        <Input type="number" value={form.cooldown_hours} onChange={(e) => setForm({ ...form, cooldown_hours: Number(e.target.value) })} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        <Label>Active</Label>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)}>Save</Button>
      </DialogFooter>
    </div>
  )
}
