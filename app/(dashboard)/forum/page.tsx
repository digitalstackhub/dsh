import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MessageSquare, Plus, User } from 'lucide-react'

export default async function ForumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: categories } = await supabase
    .from('forum_categories')
    .select('*, forum_topics(count)')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  const { data: topics } = await supabase
    .from('forum_topics')
    .select('*, profiles(full_name, avatar_url), forum_categories(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Discuss, share, and learn.</p>
        </div>
        <Link href="/dashboard/forum/new">
          <Button>
            <Plus className="h-4 w-4 mr-1" /> New Topic
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<Skeleton className="h-60 rounded-2xl" />}>
            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Recent Topics</CardTitle>
              </CardHeader>
              <CardContent>
                {!topics?.length ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No topics yet. Start a discussion!</p>
                ) : (
                  <div className="space-y-3">
                    {topics.map((topic: any) => (
                      <Link
                        key={topic.id}
                        href={`/dashboard/forum/${topic.slug}`}
                        className="flex items-center justify-between p-3 bg-dark-900 rounded-xl border border-white/5 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{topic.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {topic.profiles?.full_name || 'Anonymous'}
                              </span>
                              <span>· {topic.reply_count || 0} replies</span>
                              <Badge variant="outline" className="text-xs">{topic.forum_categories?.name}</Badge>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(topic.created_at).toLocaleDateString()}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Suspense>
        </div>

        <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
          <Card className="border-white/10 h-fit">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories?.map((cat: any) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.forum_topics?.length || 0} topics</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}
