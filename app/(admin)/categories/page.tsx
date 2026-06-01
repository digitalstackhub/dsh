'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash, GripVertical } from 'lucide-react'

export default function AdminCategoriesPage() {
  const { supabase } = useSupabase()
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('resource_categories').select('*').order('display_order')
    setCategories(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (cat: any) => {
    if (cat.id) {
      await supabase.from('resource_categories').update(cat).eq('id', cat.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('resource_categories').insert(cat)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await supabase.from('resource_categories').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Icon</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.display_order}</td>
                  <td className="font-medium">{cat.name}</td>
                  <td className="text-muted-foreground">{cat.slug}</td>
                  <td>{cat.icon}</td>
                  <td><Switch checked={cat.is_active} disabled /></td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(cat); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
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
            <DialogTitle>{editing?.id ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <CategoryForm category={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CategoryForm({ category, onSave }: any) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    icon: '',
    display_order: 0,
    is_active: true,
    ...category,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Icon (Lucide name)</Label>
        <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
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
