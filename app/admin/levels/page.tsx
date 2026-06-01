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
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminLevelsPage() {
  const { supabase } = useSupabase()
  const [levels, setLevels] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('levels').select('*').order('min_points', { ascending: true })
    setLevels(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (level: any) => {
    if (level.id) {
      await supabase.from('levels').update(level).eq('id', level.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('levels').insert(level)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this level?')) {
      await supabase.from('levels').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Levels</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add Level
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Min Points</th>
                <th>Max Points</th>
                <th>Color</th>
                <th>Badge Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((l) => (
                <tr key={l.id}>
                  <td className="font-medium" style={{ color: l.color }}>{l.level_name}</td>
                  <td>{l.min_points}</td>
                  <td>{l.max_points || '∞'}</td>
                  <td><span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: l.color }} /></td>
                  <td>{l.badge_icon}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(l); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(l.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
            <DialogTitle>{editing?.id ? 'Edit Level' : 'Add Level'}</DialogTitle>
          </DialogHeader>
          <LevelForm level={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LevelForm({ level, onSave }: any) {
  const [form, setForm] = useState({
    level_name: '',
    min_points: 0,
    max_points: null,
    badge_icon: '',
    color: '#6366F1',
    display_order: 0,
    ...level,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={form.level_name} onChange={(e) => setForm({ ...form, level_name: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Points</Label>
          <Input type="number" value={form.min_points} onChange={(e) => setForm({ ...form, min_points: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Max Points (blank for no limit)</Label>
          <Input type="number" value={form.max_points || ''} onChange={(e) => setForm({ ...form, max_points: e.target.value ? Number(e.target.value) : null })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Badge Icon (Lucide name)</Label>
          <Input value={form.badge_icon} onChange={(e) => setForm({ ...form, badge_icon: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Display Order</Label>
        <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)}>Save</Button>
      </DialogFooter>
    </div>
  )
}
