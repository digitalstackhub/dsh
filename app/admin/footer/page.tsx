'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminFooterPage() {
  const { supabase } = useSupabase()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('footer_links').select('*').order('display_order')
    setItems(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (item: any) => {
    if (item.id) {
      await supabase.from('footer_links').update(item).eq('id', item.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('footer_links').insert(item)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) {
      await supabase.from('footer_links').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Footer Links</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Section</th>
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.title}</td>
                  <td className="text-muted-foreground text-sm">{item.url}</td>
                  <td><Badge variant="info">{item.section}</Badge></td>
                  <td>{item.display_order}</td>
                  <td><Badge variant={item.is_active ? 'success' : 'secondary'}>{item.is_active ? 'Yes' : 'No'}</Badge></td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(item); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editing?.id ? 'Edit' : 'Create'} Footer Link</DialogTitle>
          </DialogHeader>
          <FooterLinkForm item={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FooterLinkForm({ item, onSave }: any) {
  const [form, setForm] = useState({
    title: '',
    url: '/',
    section: 'company',
    display_order: 0,
    is_active: true,
    ...item,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>URL</Label>
        <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Section</Label>
        <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Display Order</Label>
        <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
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
