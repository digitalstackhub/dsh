import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    const supabase = await createServiceClient()
    
    // Log the action
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('admin_activity_log').insert({
      user_id: user?.id,
      action: 'clear_cache',
      details: { message: 'Cache manually cleared by admin' },
      ip_address: 'server',
    })

    // Revalidate all major paths
    revalidatePath('/', 'layout')
    revalidatePath('/admin', 'layout')
    revalidatePath('/dashboard', 'layout')
    revalidatePath('/resources', 'layout')
    revalidatePath('/pricing', 'layout')

    return NextResponse.json({ success: true, message: 'Cache cleared successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
