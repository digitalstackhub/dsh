'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function TrialCountdown({ trialEndsAt }: { trialEndsAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null)

  useEffect(() => {
    if (!trialEndsAt) return
    const end = new Date(trialEndsAt).getTime()
    const update = () => {
      const now = Date.now()
      const diff = end - now
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      })
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [trialEndsAt])

  if (!trialEndsAt || !timeLeft || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0)) {
    return null // No trial or trial expired
  }

  return (
    <Card className="p-6 border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Trial Active</h3>
          <p className="text-xs text-muted-foreground">Your free trial is ending soon</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Min', value: timeLeft.minutes },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex-1 bg-dark-900 rounded-lg p-3 text-center border border-white/10"
          >
            <span className="text-2xl font-bold text-amber-400">{unit.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{unit.label}</p>
          </div>
        ))}
      </div>

      <Link href="/dashboard/membership">
        <Button className="w-full" variant="default">
          Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </Card>
  )
}
