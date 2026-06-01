import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

// Cache settings for 5 minutes using React cache
export const getSettings = cache(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('system_settings')
    .select('setting_key, setting_value, setting_type')
  if (error) throw error
  const settings: Record<string, string> = {}
  data?.forEach((row) => {
    settings[row.setting_key] = row.setting_value
  })
  return settings
})

export async function getSetting(key: string, defaultValue?: string) {
  const settings = await getSettings()
  return settings[key] || defaultValue || ''
}

export async function getBooleanSetting(key: string, defaultValue = false) {
  const value = await getSetting(key)
  return value ? value === 'true' : defaultValue
}

export async function getNumberSetting(key: string, defaultValue = 0) {
  const value = await getSetting(key)
  return value ? Number(value) : defaultValue
}
