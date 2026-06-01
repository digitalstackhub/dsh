'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Download, Gift, Star, User, MessageSquare, LogIn } from 'lucide-react'

const iconMap: Record<string, any> = {
  login: LogIn,
  download: Download,
  points_earned: Gift,
  purchase: Star,
  referral: User,
  forum_post: MessageSquare,
  review: Star,
}

export function ActivityFeed({ activities }: { activities: any[] }) {
  if (!activities.length) {
    return (
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">No activity yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity: any, i: number) => {
            const Icon = iconMap[activity.activity_type] || Activity
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl border border-white/5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString()} · {new Date(activity.created_at).toLocaleTimeString()}
                  </p>
                </div>
                {activity.points_change !== 0 && (
                  <Badge variant={activity.points_change > 0 ? 'success' : 'secondary'}>
                    {activity.points_change > 0 ? '+' : ''}{activity.points_change} pts
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
