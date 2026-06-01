'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const { supabase } = useSupabase()
  const [settings, setSettings] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('general')

  const fetch = async () => {
    const { data } = await supabase.from('system_settings').select('*').order('setting_key')
    setSettings(data || [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (setting: any) => {
    await supabase
      .from('system_settings')
      .update({ setting_value: setting.setting_value })
      .eq('id', setting.id)
    toast({ title: 'Saved', variant: 'success' })
  }

  const categories = [...new Set(settings.map((s) => s.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="border-white/10">
        <CardContent className="p-6 space-y-6">
          {settings
            .filter((s) => s.category === activeCategory)
            .map((setting) => (
              <div key={setting.id} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0">
                <div className="flex-1">
                  <Label className="text-sm font-medium">{setting.label}</Label>
                  {setting.description && (
                    <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 min-w-[200px]">
                  {setting.setting_type === 'boolean' ? (
                    <Switch
                      checked={setting.setting_value === 'true'}
                      onCheckedChange={(v) => {
                        const updated = { ...setting, setting_value: v.toString() }
                        handleSave(updated)
                        setSettings(settings.map((s) => (s.id === setting.id ? updated : s)))
                      }}
                    />
                  ) : setting.setting_type === 'number' ? (
                    <Input
                      type="number"
                      value={setting.setting_value}
                      onChange={(e) => {
                        const updated = { ...setting, setting_value: e.target.value }
                        setSettings(settings.map((s) => (s.id === setting.id ? updated : s)))
                      }}
                      onBlur={() => handleSave(setting)}
                      className="w-24 h-9 text-sm"
                    />
                  ) : (
                    <Input
                      value={setting.setting_value}
                      onChange={(e) => {
                        const updated = { ...setting, setting_value: e.target.value }
                        setSettings(settings.map((s) => (s.id === setting.id ? updated : s)))
                      }}
                      onBlur={() => handleSave(setting)}
                      className="h-9 text-sm"
                    />
                  )}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
