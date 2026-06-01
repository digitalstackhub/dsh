'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function ResourceFilters({ categories }: { categories: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    router.push(/resources?)
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(/resources?)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/5"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategory(null)}
          className={cn(
            'pill',
            !currentCategory && 'pill-active'
          )}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.slug)}
            className={cn(
              'pill',
              currentCategory === cat.slug && 'pill-active'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
