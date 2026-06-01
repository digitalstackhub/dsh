import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border border-white/10">
          <span className="text-5xl font-bold text-gradient">404</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
