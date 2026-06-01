'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Gift, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function PointsCard({
  points,
  totalPoints,
  currentLevel,
  nextLevel,
}: {
  points: number
  totalPoints: number
  currentLevel: any
  nextLevel: any
}) {
  const progress = nextLevel
    ? Math.round(((points - currentLevel?.min_points) / (nextLevel.min_points - currentLevel?.min_points)) * 100)
    : 100

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentLevel?.color + '30' || '#6366F130' }}
            >
              <Gift className="h-5 w-5" style={{ color: currentLevel?.color || '#6366F1' }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Points & Rewards</h3>
              <p className="text-xs text-muted-foreground">Level: {currentLevel?.level_name || 'Bronze'}</p>
            </div>
          </div>
          <Trophy
            className="h-5 w-5"
            style={{ color: currentLevel?.color || '#6366F1' }}
          />
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-lg">{points.toLocaleString()}</span>
            <span className="text-muted-foreground">
              {nextLevel ? ${nextLevel.min_points.toLocaleString()} pts : 'Max Level'}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Total earned: <span className="text-foreground font-medium">{totalPoints.toLocaleString()}</span>
          </p>
          <Link href="/dashboard/points">
            <span className="text-xs text-primary hover:underline flex items-center gap-1">
              Earn More <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </div>
    </Card>
  )
}
