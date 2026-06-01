import { createClient } from '@/lib/supabase/server'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Lock, Zap, Globe, Headphones, Shield } from 'lucide-react'

const iconMap: Record<string, any> = {
  Database,
  Lock,
  Zap,
  Globe,
  Headphones,
  Shield,
}

// Static feature list (could be database-driven via a features table)
const features = [
  {
    title: 'Massive Library',
    description: 'Access thousands of premium resources across multiple categories.',
    icon: 'Database',
  },
  {
    title: 'Secure Downloads',
    description: 'All resources are virus-scanned and verified by our team.',
    icon: 'Shield',
  },
  {
    title: 'Instant Access',
    description: 'No waiting. Download resources immediately after subscribing.',
    icon: 'Zap',
  },
  {
    title: 'Global Access',
    description: 'Access your downloads from anywhere in the world.',
    icon: 'Globe',
  },
  {
    title: '24/7 Support',
    description: 'Our support team is always ready to help you.',
    icon: 'Headphones',
  },
  {
    title: 'Lifetime Updates',
    description: 'Get free updates for all purchased resources.',
    icon: 'Lock',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-dark-800/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You{' '}
            <span className="text-gradient">Need</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and resources you need to build amazing websites and applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border-white/10 hover:border-primary/30 transition-all duration-300 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
