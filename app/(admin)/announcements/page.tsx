'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminAnnouncementsPage() {
  const { supabase } = useSupabase()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (a: any) => {
    if (a.id) {
      await supabase.from('announcements').update(a).eq('id', a.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('announcements').insert(a)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) {
      await supabase.from('announcements').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Active</th>
                <th>Dismissible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{a.title}</td>
                  <td><Badge variant={a.type === 'success' ? 'success' : a.type === 'warning' ? 'warning' : 'info'}>{a.type}</Badge></td>
                  <td className="text-xs">{new Date(a.start_date).toLocaleDateString()} - {a.end_date ? new Date(a.end_date).toLocaleDateString() : '∞'}</td>
                  <td><Badge variant={a.is_active ? 'success' : 'secondary'}>{a.is_active ? 'Yes' : 'No'}</Badge></td>
                  <td>{a.dismissible ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(a); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(a.id)}>
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
            <DialogTitle>{editing?.id ? 'Edit' : 'Create'} Announcement</DialogTitle>
          </DialogHeader>
          <AnnouncementForm announcement={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AnnouncementForm({ announcement, onSave }: any) {
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    dismissible: true,
    ...announcement,
    start_date: announcement?.start_date ? new Date(announcement.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    end_date: announcement?.end_date ? new Date(announcement.end_date).toISOString().split('T')[0] : '',
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>End Date (optional)</Label>
        <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <Label>Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.dismissible} onCheckedChange={(v) => setForm({ ...form, dismissible: v })} />
          <Label>Dismissible</Label>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)}>Save</Button>
      </DialogFooter>
    </div>
  )
}
