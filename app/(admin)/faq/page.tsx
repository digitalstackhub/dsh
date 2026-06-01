'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminFaqPage() {
  const { supabase } = useSupabase()
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const [{ data: faq }, { data: cats }] = await Promise.all([
      supabase.from('faq_items').select('*, faq_categories(name)').order('display_order'),
      supabase.from('faq_categories').select('*').order('display_order'),
    ])
    setItems(faq || [])
    setCategories(cats || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (item: any) => {
    if (item.id) {
      await supabase.from('faq_items').update(item).eq('id', item.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('faq_items').insert(item)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) {
      await supabase.from('faq_items').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQ</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.question}</td>
                  <td>{item.faq_categories?.name}</td>
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
            <DialogTitle>{editing?.id ? 'Edit' : 'Create'} FAQ Item</DialogTitle>
          </DialogHeader>
          <FaqForm item={editing} categories={categories} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FaqForm({ item, categories, onSave }: any) {
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category_id: '',
    display_order: 0,
    is_active: true,
    ...item,
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question</Label>
        <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Answer</Label>
        <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {categories.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <Label>Active</Label>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)}>Save</Button>
      </DialogFooter>
    </div>
  )
}
