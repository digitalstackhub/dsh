import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Headphones, Plus, Clock, MessageSquare } from 'lucide-react'

export default async function SupportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user's tickets
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*, support_categories(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-muted-foreground">Get help with any issues.</p>
        </div>
        <Link href="/dashboard/support/new">
          <Button>
            <Plus className="h-4 w-4 mr-1" /> New Ticket
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-60 rounded-2xl" />}>
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>My Tickets</CardTitle>
            <CardDescription>Your support requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {!tickets?.length ? (
              <div className="text-center py-8">
                <Headphones className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No tickets yet. Create one if you need help.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket: any) => (
                  <Link
                    key={ticket.id}
                    href={/dashboard/support/}
                    className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-white/5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ticket.subject}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant={ticket.status === 'open' ? 'warning' : ticket.status === 'resolved' ? 'success' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          {ticket.support_categories?.name && <span>{ticket.support_categories.name}</span>}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">View</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}
