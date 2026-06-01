import { createClient } from '@/lib/supabase/server'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export async function TestimonialsSection() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, profiles!inner(full_name, avatar_url)')
    .eq('is_approved', true)
    .order('display_order', { ascending: true })
    .limit(6)

  if (!testimonials?.length) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by{' '}
            <span className="text-gradient">Creators</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from developers and designers who use our resources daily.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 border-white/10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={t.profiles?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                      {(t.profiles?.full_name || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.profiles?.full_name || 'Anonymous'}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3 w-3 ${idx < t.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{t.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
