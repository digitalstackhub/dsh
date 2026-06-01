import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Download, ExternalLink, Calendar } from 'lucide-react'

export default async function DownloadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user's downloads with resource details
  const { data: downloads } = await supabase
    .from('downloads')
    .select('id, downloaded_at, resources!inner(title, slug, file_size, file_type, external_url)')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Downloads</h1>
        <p className="text-muted-foreground">Resources you have downloaded.</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        }
      >
        {!downloads?.length ? (
          <Card className="border-white/10">
            <CardContent className="py-12 text-center">
              <Download className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No downloads yet</h3>
              <p className="text-muted-foreground mb-4">Start browsing the resource library.</p>
              <Link href="/resources">
                <Button>Browse Resources</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {downloads.map((d: any) => (
              <Card key={d.id} className="border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{d.resources?.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {d.resources?.file_size && <span>{d.resources.file_size}</span>}
                        {d.resources?.file_type && <Badge variant="outline" className="text-xs">{d.resources.file_type.toUpperCase()}</Badge>}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(d.downloaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a href={d.resources?.external_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  )
}
