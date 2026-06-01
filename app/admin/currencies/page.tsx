'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Edit } from 'lucide-react'

export default function AdminCurrenciesPage() {
  const { supabase } = useSupabase()
  const [currencies, setCurrencies] = useState<any[]>([])

  const fetch = async () => {
    const { data } = await supabase.from('currencies').select('*').order('code')
    setCurrencies(data || [])
  }

  useEffect(() => { fetch() }, [])

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('currencies').update({ is_active: !current }).eq('id', id)
    toast({ title: current ? 'Disabled' : 'Enabled', variant: 'success' })
    fetch()
  }

  const updateRate = async (id: string, rate: number) => {
    await supabase.from('currencies').update({ exchange_rate: rate }).eq('id', id)
    toast({ title: 'Rate updated', variant: 'success' })
    fetch()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Currencies</h1>
      <Card className="border-white/10">
        <CardContent className="p-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Flag</th>
                <th>Code</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Rate (to USD)</th>
                <th>Default</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((c) => (
                <tr key={c.id}>
                  <td className="text-xl">{c.flag_icon}</td>
                  <td className="font-mono font-bold">{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.symbol}</td>
                  <td>
                    <Input
                      type="number"
                      step="0.0000000001"
                      defaultValue={c.exchange_rate}
                      className="w-24 h-8 text-xs"
                      onBlur={(e) => {
                        const newRate = Number(e.target.value)
                        if (newRate !== c.exchange_rate) updateRate(c.id, newRate)
                      }}
                    />
                  </td>
                  <td>
                    <Badge variant={c.is_default ? 'success' : 'secondary'}>
                      {c.is_default ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td>
                    <Switch
                      checked={c.is_active}
                      onCheckedChange={() => toggleActive(c.id, c.is_active)}
                    />
                  </td>
                  <td>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
