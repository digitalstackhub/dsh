'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface PricingCardProps {
  plan: {
    id: string
    name: string
    description: string
    price_monthly: number
    price_yearly: number | null
    features: Array<{ icon?: string; text: string; included: boolean }>
    popular_badge?: boolean
    trial_days?: number
    color?: string
  }
  currency?: string
  yearly?: boolean
}

export function PricingCard({ plan, currency = '$', yearly = false }: PricingCardProps) {
  const price = yearly && plan.price_yearly ? plan.price_yearly : plan.price_monthly
  const period = yearly ? '/year' : '/month'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="relative group"
    >
      {plan.popular_badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="success" className="shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}
      <Card
        className={p-6 border-2 h-full flex flex-col transition-all duration-300 }
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              {price === 0 ? 'Free' : ${currency}}
            </span>
            {price > 0 && <span className="text-muted-foreground text-sm">{period}</span>}
          </div>
          {plan.trial_days && plan.trial_days > 0 && (
            <p className="text-xs text-emerald-400 mt-1">{plan.trial_days}-day free trial</p>
          )}
        </div>

        <ul className="space-y-3 flex-1 mb-6">
          {plan.features?.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              {feature.included ? (
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              )}
              <span className={feature.included ? '' : 'text-muted-foreground/50 line-through'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Link href={price === 0 ? '/register' : /checkout?plan=} className="mt-auto">
          <Button
            className="w-full"
            variant={plan.popular_badge ? 'default' : 'outline'}
            style={
              plan.popular_badge && plan.color
                ? {
                    background: linear-gradient(135deg, , dd),
                  }
                : undefined
            }
          >
            {price === 0 ? 'Get Started' : 'Subscribe Now'}
          </Button>
        </Link>
      </Card>
    </motion.div>
  )
}
