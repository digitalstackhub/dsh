import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="space-y-8 w-full max-w-2xl p-8">
        <Skeleton className="h-12 w-64 mx-auto rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4 rounded-xl" />
        <Skeleton className="h-8 w-1/2 rounded-xl" />
      </div>
    </div>
  )
}
