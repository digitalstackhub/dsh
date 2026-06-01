'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Ticket,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bell,
  Shield,
  List,
  Star,
  HelpCircle,
  Menu,
  Globe,
  CreditCard,
  Image,
  Database,
  Activity,
  Cpu,
  HardDrive,
  Clock,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Plans', url: '/admin/plans', icon: Tag },
  { title: 'Resources', url: '/admin/resources', icon: Package },
  { title: 'Categories', url: '/admin/categories', icon: List },
  { title: 'Coupons', url: '/admin/coupons', icon: Ticket },
  { title: 'Trials', url: '/admin/trials', icon: Clock },
  { title: 'Tickets', url: '/admin/tickets', icon: Ticket },
  { title: 'Forum', url: '/admin/forum', icon: MessageSquare },
  { title: 'Points Rules', url: '/admin/points-rules', icon: Star },
  { title: 'Levels', url: '/admin/levels', icon: BarChart3 },
  { title: 'Email Templates', url: '/admin/email-templates', icon: FileText },
  { title: 'Announcements', url: '/admin/announcements', icon: Bell },
  { title: 'Testimonials', url: '/admin/testimonials', icon: Star },
  { title: 'FAQ', url: '/admin/faq', icon: HelpCircle },
  { title: 'Navigation', url: '/admin/navigation', icon: Menu },
  { title: 'Footer Links', url: '/admin/footer', icon: Menu },
  { title: 'Currencies', url: '/admin/currencies', icon: Globe },
  { title: 'Payment Gateways', url: '/admin/payment-gateways', icon: CreditCard },
  { title: 'Advertisements', url: '/admin/ads', icon: Image },
  { title: 'System Settings', url: '/admin/settings', icon: Settings },
  { title: 'Activity Log', url: '/admin/activity-log', icon: Activity },
  { title: 'Cache Management', url: '/admin/cache-management', icon: Cpu },
  { title: 'Database Backup', url: '/admin/database-backup', icon: HardDrive },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      className="hidden lg:flex flex-col border-r border-white/5 bg-dark-800/50 backdrop-blur-xl relative z-20"
    >
      <div className="flex items-center justify-between p-6">
        {!collapsed && (
          <motion.span className="text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Admin Panel
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

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                pathname === item.url || (item.url !== '/admin' && pathname.startsWith(item.url))
                  ? 'bg-white/10 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <motion.span>{item.title}</motion.span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </motion.aside>
  )
}
