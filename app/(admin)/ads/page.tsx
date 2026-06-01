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
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash, Eye, MousePointer } from 'lucide-react'

export default function AdminAdsPage() {
  const { supabase } = useSupabase()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (ad: any) => {
    if (ad.id) {
      await supabase.from('advertisements').update(ad).eq('id', ad.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('advertisements').insert(ad)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) {
      await supabase.from('advertisements').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Advertisements</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Create Ad
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Placement</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ad) => (
                <tr key={ad.id}>
                  <td className="font-medium">{ad.name}</td>
                  <td><Badge variant="info">{ad.type}</Badge></td>
                  <td>{ad.placement}</td>
                  <td className="flex items-center gap-1"><Eye className="h-3 w-3" /> {ad.impressions_count}/{ad.impressions_limit || '∞'}</td>
                  <td className="flex items-center gap-1"><MousePointer className="h-3 w-3" /> {ad.clicks_count}/{ad.clicks_limit || '∞'}</td>
                  <td><Badge variant={ad.is_active ? 'success' : 'secondary'}>{ad.is_active ? 'Active' : 'Paused'}</Badge></td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(ad); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(ad.id)}>
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
            <DialogTitle>{editing?.id ? 'Edit' : 'Create'} Advertisement</DialogTitle>
          </DialogHeader>
          <AdForm ad={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdForm({ ad, onSave }: any) {
  const [form, setForm] = useState({
    name: '',
    type: 'image',
    content: '',
    placement: 'header',
    impressions_limit: 0,
    clicks_limit: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    ...ad,
    start_date: ad?.start_date ? new Date(ad.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    end_date: ad?.end_date ? new Date(ad.end_date).toISOString().split('T')[0] : '',
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="image">Image</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Placement</Label>
          <Input value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Content (URL or HTML)</Label>
        <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Impressions Limit (0 = unlimited)</Label>
          <Input type="number" value={form.impressions_limit} onChange={(e) => setForm({ ...form, impressions_limit: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Clicks Limit (0 = unlimited)</Label>
          <Input type="number" value={form.clicks_limit} onChange={(e) => setForm({ ...form, clicks_limit: Number(e.target.value) })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
        </div>
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
