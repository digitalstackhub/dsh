'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
}

const colorMap: Record<string, string> = {
  info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  error: 'bg-red-500/10 border-red-500/30 text-red-300',
}

export function AnnouncementBanner({ announcement }: { announcement: any }) {
  const [dismissed, setDismissed] = useState(false)
  const Icon = iconMap[announcement.type] || Info

  if (!announcement.dismissible || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={cn(
          'border-b px-4 py-3 text-sm flex items-center justify-between',
          colorMap[announcement.type]
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{announcement.message}</span>
        </div>
        {announcement.dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="hover:bg-white/10 rounded-full p-1"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
