'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Download,
  Crown,
  Gift,
  Users,
  MessageSquare,
  Headphones,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-provider'

const iconMap: Record<string, any> = {
  LayoutDashboard: LayoutDashboard,
  Download: Download,
  Crown: Crown,
  Gift: Gift,
  Users: Users,
  MessageSquare: MessageSquare,
  Headphones: Headphones,
  Settings: Settings,
}

const defaultMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Downloads', url: '/dashboard/downloads', icon: 'Download' },
  { title: 'Membership', url: '/dashboard/membership', icon: 'Crown' },
  { title: 'Points & Rewards', url: '/dashboard/points', icon: 'Gift' },
  { title: 'Affiliate', url: '/dashboard/affiliate', icon: 'Users' },
  { title: 'Forum', url: '/dashboard/forum', icon: 'MessageSquare' },
  { title: 'Support', url: '/dashboard/support', icon: 'Headphones' },
  { title: 'Settings', url: '/dashboard/settings', icon: 'Settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useSupabase()

  const isActive = (url: string) => pathname === url

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      className="hidden lg:flex flex-col border-r border-white/5 bg-dark-800/50 backdrop-blur-xl relative z-20"
    >
      <div className="flex items-center justify-between p-6">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          >
            DSH
          </motion.span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-white/5"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {defaultMenuItems.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.url)
                  ? 'bg-white/10 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" />}
              {!collapsed && <motion.span initial={false}>{item.title}</motion.span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="text-sm">
              <p className="font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Member</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
