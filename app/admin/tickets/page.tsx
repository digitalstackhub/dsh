'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Eye } from 'lucide-react'

export default function AdminTicketsPage() {
  const { supabase } = useSupabase()
  const [tickets, setTickets] = useState<any[]>([])
  const [viewing, setViewing] = useState<any>(null)
  const [reply, setReply] = useState('')

  const fetchTickets = async () => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*, profiles(full_name, email), support_categories(name)')
      .order('created_at', { ascending: false })
    setTickets(data || [])
  }

  useEffect(() => { fetchTickets() }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('support_tickets').update({ status }).eq('id', id)
    toast({ title: 'Status updated', variant: 'success' })
    fetchTickets()
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('support_replies').insert({
      ticket_id: viewing.id,
      user_id: user?.id,
      message: reply,
      is_staff_reply: true,
    })
    toast({ title: 'Reply sent', variant: 'success' })
    setReply('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>User</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">{t.subject}</td>
                  <td>{t.profiles?.full_name || t.profiles?.email}</td>
                  <td>{t.support_categories?.name}</td>
                  <td><Badge variant={t.priority === 'urgent' ? 'destructive' : 'info'}>{t.priority}</Badge></td>
                  <td><Badge variant={t.status === 'open' ? 'warning' : 'success'}>{t.status}</Badge></td>
                  <td className="text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewing(t)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <select
                        className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs"
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewing?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Message:</p>
              <p className="text-sm">{viewing?.message}</p>
            </div>
            <div>
              <Label>Reply</Label>
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={sendReply}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
