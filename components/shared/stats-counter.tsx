'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StatsCounterProps {
  title: string
  value: number
  icon: React.ReactNode
  trend?: string
}

export function StatsCounter({ title, value, icon, trend }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const end = value
          const duration = 1500
          const step = Math.ceil(end / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-muted-foreground/60">{icon}</span>
        </div>
        <div className="text-3xl font-bold text-foreground">{count.toLocaleString()}</div>
        {trend && (
          <Badge variant="success" className="mt-2">
            {trend}
          </Badge>
        )}
      </Card>
    </motion.div>
  )
}
