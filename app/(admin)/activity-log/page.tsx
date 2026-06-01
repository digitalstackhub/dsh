'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Search } from 'lucide-react'

export default function AdminActivityLogPage() {
  const { supabase } = useSupabase()
  const [logs, setLogs] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const fetch = async () => {
    const { data } = await supabase
      .from('admin_activity_log')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(200)
    setLogs(data || [])
  }

  useEffect(() => { fetch() }, [])

  const filtered = search
    ? logs.filter(
        (l) =>
          l.action.toLowerCase().includes(search.toLowerCase()) ||
          l.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
          l.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
      )
    : logs

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td className="font-medium">{log.profiles?.full_name || log.profiles?.email || 'System'}</td>
                  <td>{log.action}</td>
                  <td className="text-xs text-muted-foreground max-w-xs truncate">
                    {JSON.stringify(log.details)}
                  </td>
                  <td className="text-xs font-mono">{log.ip_address}</td>
                  <td className="text-xs">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
