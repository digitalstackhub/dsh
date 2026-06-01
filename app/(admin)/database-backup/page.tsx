'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { HardDrive, Download } from 'lucide-react'

export default function AdminDatabaseBackupPage() {
  const [backingUp, setBackingUp] = useState(false)

  const triggerBackup = async () => {
    setBackingUp(true)
    try {
      const res = await fetch('/api/admin/backup', { method: 'POST' })
      if (res.ok) {
        toast({ title: 'Backup Started', description: 'Database backup has been initiated.', variant: 'success' })
      } else {
        toast({ title: 'Error', description: 'Failed to start backup.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to reach API.', variant: 'destructive' })
    } finally {
      setBackingUp(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Database Backup</h1>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>Manual Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Trigger a manual backup of your entire database. Supabase automatically creates daily backups on paid plans.
          </p>
          <Button onClick={triggerBackup} disabled={backingUp} size="lg">
            <HardDrive className={h-4 w-4 mr-2 } />
            {backingUp ? 'Starting Backup...' : 'Create Backup'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>Recent Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Backup history will appear here. On Supabase, backups are managed in the dashboard.
          </p>
          <Button variant="outline" asChild className="w-full">
            <a href="https://supabase.com/dashboard/project/_/database/backups" target="_blank" rel="noopener">
              <Download className="h-4 w-4 mr-2" /> Go to Supabase Backups
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
