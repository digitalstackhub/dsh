'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In a real app, you'd save to the database or use an email service
    setTimeout(() => {
      toast({ title: 'Subscribed!', description: 'You are now on our newsletter.', variant: 'success' })
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter and get notified about new resources, exclusive deals, and tips.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
