'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminResourcesPage() {
  const { supabase } = useSupabase()
  const [resources, setResources] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const [res, cat] = await Promise.all([
      supabase.from('resources').select('*, resource_categories(name)').order('created_at', { ascending: false }),
      supabase.from('resource_categories').select('*').eq('is_active', true),
    ])
    setResources(res.data || [])
    setCategories(cat.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async (resource: any) => {
    if (resource.id) {
      const { error } = await supabase.from('resources').update(resource).eq('id', resource.id)
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
      else toast({ title: 'Updated', variant: 'success' })
    } else {
      const { error } = await supabase.from('resources').insert(resource)
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
      else toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this resource?')) {
      await supabase.from('resources').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add Resource
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Points Req</th>
                <th>Downloads</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.title}</td>
                  <td>{r.resource_categories?.name}</td>
                  <td>{r.points_required}</td>
                  <td>{r.download_count}</td>
                  <td>
                    <Badge variant={r.is_active ? 'success' : 'secondary'}>
                      {r.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(r); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
          </DialogHeader>
          <ResourceForm
            resource={editing}
            categories={categories}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ResourceForm({ resource, categories, onSave }: any) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    external_url: '',
    file_size: '',
    file_type: '',
    points_required: 0,
    points_reward: 10,
    is_active: true,
    is_featured: false,
    ...resource,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>External URL</Label>
        <Input value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>File Size</Label>
          <Input value={form.file_size} onChange={(e) => setForm({ ...form, file_size: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>File Type</Label>
          <Input value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Points Required</Label>
          <Input type="number" value={form.points_required} onChange={(e) => setForm({ ...form, points_required: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Points Reward</Label>
          <Input type="number" value={form.points_reward} onChange={(e) => setForm({ ...form, points_reward: Number(e.target.value) })} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <Label>Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
          <Label>Featured</Label>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)}>Save</Button>
      </DialogFooter>
    </div>
  )
}
