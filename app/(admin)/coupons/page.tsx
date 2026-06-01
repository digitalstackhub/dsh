'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminCouponsPage() {
  const { supabase } = useSupabase()
  const [coupons, setCoupons] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (coupon: any) => {
    if (coupon.id) {
      await supabase.from('coupons').update(coupon).eq('id', coupon.id)
      toast({ title: 'Updated', variant: 'success' })
    } else {
      await supabase.from('coupons').insert(coupon)
      toast({ title: 'Created', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this coupon?')) {
      await supabase.from('coupons').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={() => { setEditing({}); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Create Coupon
        </Button>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Usage</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono font-bold">{c.code}</td>
                  <td>{c.discount_type === 'percentage' ? ${c.discount_value}% : $}</td>
                  <td>{c.used_count}/{c.usage_limit}</td>
                  <td className="text-xs">{c.valid_until ? new Date(c.valid_until).toLocaleDateString() : 'No limit'}</td>
                  <td>
                    <Badge variant={c.is_active ? 'success' : 'secondary'}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(c); setDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
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
            <DialogTitle>{editing?.id ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
          </DialogHeader>
          <CouponForm coupon={editing} onSave={handleSave} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CouponForm({ coupon, onSave }: any) {
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    usage_limit: 100,
    min_purchase: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    is_active: true,
    ...coupon,
    valid_from: coupon?.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    valid_until: coupon?.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Code</Label>
        <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Discount Type</Label>
          <select
            className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4"
            value={form.discount_type}
            onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Discount Value</Label>
          <Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Usage Limit</Label>
          <Input type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Min Purchase</Label>
          <Input type="number" value={form.min_purchase} onChange={(e) => setForm({ ...form, min_purchase: Number(e.target.value) })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Valid From</Label>
          <Input type="date" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Valid Until</Label>
          <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
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
