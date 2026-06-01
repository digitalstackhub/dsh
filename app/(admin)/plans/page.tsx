'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react'

export default function AdminPlansPage() {
  const { supabase } = useSupabase()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchPlans = async () => {
    const { data } = await supabase.from('plans').select('*').order('display_order')
    setPlans(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPlans() }, [])

  const handleSave = async (plan: any) => {
    if (plan.id) {
      const { error } = await supabase.from('plans').update(plan).eq('id', plan.id)
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
      else toast({ title: 'Updated', variant: 'success' })
    } else {
      const { error } = await supabase.from('plans').insert(plan)
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
      else toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditingPlan(null)
    fetchPlans()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this plan?')) {
      const { error } = await supabase.from('plans').delete().eq('id', id)
      if (!error) toast({ title: 'Deleted', variant: 'success' })
      fetchPlans()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plans</h1>
          <p className="text-muted-foreground">Manage membership plans.</p>
        </div>
        <Button onClick={() => { setEditingPlan({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Add Plan
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Price</th>
                <th>Download Limit</th>
                <th>Points x</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.display_order}</td>
                  <td className="font-medium">
                    {plan.name}
                    {plan.popular_badge && <Badge variant="success" className="ml-2">Popular</Badge>}
                  </td>
                  <td>/mo</td>
                  <td>{plan.download_limit}</td>
                  <td>{plan.points_multiplier}x</td>
                  <td>
                    <Badge variant={plan.is_active ? 'success' : 'secondary'}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingPlan(plan); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
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
            <DialogTitle>{editingPlan?.id ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
          </DialogHeader>
          <PlanForm plan={editingPlan} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PlanForm({ plan, onSave }: { plan: any; onSave: (plan: any) => void }) {
  const [form, setForm] = useState<any>({
    name: '',
    slug: '',
    description: '',
    price_monthly: 0,
    price_yearly: null,
    display_order: 0,
    popular_badge: false,
    is_active: true,
    download_limit: 10,
    points_multiplier: 1.0,
    ...plan,
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price Monthly ($)</Label>
          <Input type="number" value={form.price_monthly} onChange={(e) => setForm({ ...form, price_monthly: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Price Yearly ($)</Label>
          <Input type="number" value={form.price_yearly || ''} onChange={(e) => setForm({ ...form, price_yearly: e.target.value ? Number(e.target.value) : null })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <Switch checked={form.popular_badge} onCheckedChange={(v) => setForm({ ...form, popular_badge: v })} />
          <Label>Popular Badge</Label>
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
