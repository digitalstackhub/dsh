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
import { Edit } from 'lucide-react'

export default function AdminPaymentGatewaysPage() {
  const { supabase } = useSupabase()
  const [gateways, setGateways] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('payment_gateways').select('*').order('gateway_name')
    setGateways(data || [])
  }

  useEffect(() => { fetch() }, [])

  const toggleEnabled = async (id: string, current: boolean) => {
    await supabase.from('payment_gateways').update({ is_enabled: !current }).eq('id', id)
    toast({ title: current ? 'Disabled' : 'Enabled', variant: 'success' })
    fetch()
  }

  const handleSave = async (gw: any) => {
    await supabase.from('payment_gateways').update({
      fee_percentage: gw.fee_percentage,
      fee_fixed: gw.fee_fixed,
      min_amount: gw.min_amount,
      max_amount: gw.max_amount,
      sandbox_mode: gw.sandbox_mode,
    }).eq('id', gw.id)
    toast({ title: 'Updated', variant: 'success' })
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment Gateways</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Gateway</th>
                <th>Enabled</th>
                <th>Fee %</th>
                <th>Fee Fixed</th>
                <th>Supported Currencies</th>
                <th>Sandbox</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gateways.map((g) => (
                <tr key={g.id}>
                  <td className="font-medium">{g.display_name}</td>
                  <td><Switch checked={g.is_enabled} onCheckedChange={() => toggleEnabled(g.id, g.is_enabled)} /></td>
                  <td>{g.fee_percentage}%</td>
                  <td>${g.fee_fixed}</td>
                  <td className="text-xs">{g.supported_currencies?.join(', ')}</td>
                  <td><Badge variant={g.sandbox_mode ? 'warning' : 'success'}>{g.sandbox_mode ? 'Sandbox' : 'Live'}</Badge></td>
                  <td>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(g); setDialogOpen(true) }}>
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
          <DialogHeader><DialogTitle>Edit: {editing?.display_name}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fee Percentage</Label><Input type="number" step="0.01" value={editing.fee_percentage} onChange={(e) => setEditing({ ...editing, fee_percentage: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Fee Fixed ($)</Label><Input type="number" step="0.01" value={editing.fee_fixed} onChange={(e) => setEditing({ ...editing, fee_fixed: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Min Amount ($)</Label><Input type="number" value={editing.min_amount} onChange={(e) => setEditing({ ...editing, min_amount: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Max Amount ($)</Label><Input type="number" value={editing.max_amount} onChange={(e) => setEditing({ ...editing, max_amount: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.sandbox_mode} onCheckedChange={(v) => setEditing({ ...editing, sandbox_mode: v })} />
                <Label>Sandbox Mode</Label>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => handleSave(editing)}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
