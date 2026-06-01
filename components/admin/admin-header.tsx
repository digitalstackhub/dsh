'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
import { useSupabase } from '@/components/providers/supabase-provider'
import { ArrowLeft, LogOut } from 'lucide-react'

export function AdminHeader({ user }: { user: any }) {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast({ title: 'Signed out' })
  }

  return (
    <header className="h-16 border-b border-white/5 bg-dark-800/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Site
        </Button>
        <span className="text-sm font-medium text-red-400">Admin Mode</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-1" /> Sign Out
        </Button>
      </div>
    </header>
  )
}
