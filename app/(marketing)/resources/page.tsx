import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Skeleton } from '@/components/ui/skeleton'
import { ResourceGrid } from '@/components/shared/resource-grid'
import { ResourceFilters } from '@/components/shared/resource-filters'

export const metadata = {
  title: 'Resource Library',
  description: 'Browse our extensive collection of premium digital resources.',
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  const category = searchParams?.category as string | undefined
  const search = searchParams?.search as string | undefined

  const { data: categories } = await supabase
    .from('resource_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  let query = supabase
    .from('resources')
    .select('*, resource_categories(name, slug)')
    .eq('is_active', true)

  if (category) {
    const { data: catData } = await supabase
      .from('resource_categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (catData) query = query.eq('category_id', catData.id)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data: resources } = await query.order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Resource <span className="text-gradient">Library</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of premium resources. Use the filters to find exactly what you need.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-12 w-full rounded-xl mb-8" />}>
          <ResourceFilters categories={categories || []} />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          }
        >
          <ResourceGrid resources={resources || []} />
        </Suspense>
      </div>
    </div>
  )
}
