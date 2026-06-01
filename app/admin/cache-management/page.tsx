'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { Cpu, RefreshCw, Database } from 'lucide-react'

export default function AdminCacheManagementPage() {
  const [clearing, setClearing] = useState(false)

  const clearCache = async () => {
    setClearing(true)
    try {
      const res = await fetch('/api/admin/clear-cache', { method: 'POST' })
      if (res.ok) {
        toast({ title: 'Cache Cleared', description: 'All pages and data caches have been refreshed.', variant: 'success' })
      } else {
        toast({ title: 'Error', description: 'Failed to clear cache.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to reach API.', variant: 'destructive' })
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cache Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <Cpu className="h-8 w-8 text-cyan-400" />
            <div>
              <p className="text-sm text-muted-foreground">Cache Status</p>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <Database className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Strategy</p>
              <p className="font-bold">TTL 5 minutes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <RefreshCw className="h-8 w-8 text-emerald-400" />
            <div>
              <p className="text-sm text-muted-foreground">Last Cleared</p>
              <p className="font-bold text-sm">On demand</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={clearCache} disabled={clearing} size="lg">
            <RefreshCw className={`h-4 w-4 mr-2 ${clearing ? 'animate-spin' : ''}`} />
            {clearing ? 'Clearing...' : 'Clear All Cache'}
          </Button>
          <p className="text-sm text-muted-foreground">
            This will invalidate all cached pages and data, forcing fresh database queries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
