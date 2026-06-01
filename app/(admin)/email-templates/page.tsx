'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Edit, Eye } from 'lucide-react'

export default function AdminEmailTemplatesPage() {
  const { supabase } = useSupabase()
  const [templates, setTemplates] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('email_templates').select('*').order('template_key')
    setTemplates(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (tpl: any) => {
    if (tpl.id) {
      await supabase.from('email_templates').update({
        subject: tpl.subject,
        html_content: tpl.html_content,
      }).eq('id', tpl.id)
      toast({ title: 'Updated', variant: 'success' })
    }
    setDialogOpen(false)
    setEditing(null)
    fetch()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Email Templates</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Subject</th>
                <th>Variables</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id}>
                  <td className="font-mono text-sm font-medium">{t.template_key}</td>
                  <td>{t.subject}</td>
                  <td className="text-xs text-muted-foreground">{t.variables_used?.join(', ')}</td>
                  <td><Badge variant={t.is_active ? 'success' : 'secondary'}>{t.is_active ? 'Yes' : 'No'}</Badge></td>
                  <td>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(t); setDialogOpen(true) }}>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Template: {editing?.template_key}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={editing.subject}
                  onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>HTML Content</Label>
                <Textarea
                  rows={15}
                  value={editing.html_content}
                  onChange={(e) => setEditing({ ...editing, html_content: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Available variables: {editing.variables_used?.join(', ')}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => handleSave(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
