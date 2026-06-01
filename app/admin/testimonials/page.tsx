'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Check, X, Trash } from 'lucide-react'

export default function AdminTestimonialsPage() {
  const { supabase } = useSupabase()
  const [items, setItems] = useState<any[]>([])

  const fetch = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { fetch() }, [])

  const approve = async (id: string) => {
    await supabase.from('testimonials').update({ is_approved: true }).eq('id', id)
    toast({ title: 'Approved', variant: 'success' })
    fetch()
  }

  const reject = async (id: string) => {
    await supabase.from('testimonials').update({ is_approved: false }).eq('id', id)
    toast({ title: 'Rejected', variant: 'warning' })
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) {
      await supabase.from('testimonials').delete().eq('id', id)
      toast({ title: 'Deleted', variant: 'success' })
      fetch()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Testimonials</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Content</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">{t.profiles?.full_name || 'Anonymous'}</td>
                  <td className="max-w-xs truncate">{t.content}</td>
                  <td>{t.rating}/5</td>
                  <td>
                    <Badge variant={t.is_approved ? 'success' : 'warning'}>
                      {t.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {!t.is_approved && (
                        <Button size="sm" variant="outline" onClick={() => approve(t.id)}>
                          <Check className="h-4 w-4 text-emerald-400" />
                        </Button>
                      )}
                      {t.is_approved && (
                        <Button size="sm" variant="outline" onClick={() => reject(t.id)}>
                          <X className="h-4 w-4 text-amber-400" />
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>
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
    </div>
  )
}
