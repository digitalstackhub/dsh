import { createClient } from '@/lib/supabase/server'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'

export async function FaqSection() {
  const supabase = await createClient()

  const { data: faqItems } = await supabase
    .from('faq_items')
    .select('*, faq_categories(name)')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (!faqItems?.length) return null

  // Group by category
  const grouped: Record<string, any[]> = {}
  faqItems.forEach((item: any) => {
    const cat = item.faq_categories?.name || 'General'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  })

  return (
    <section className="py-20 px-4 bg-dark-800/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Find answers to common questions about our platform.
          </p>
        </motion.div>

        <Card className="p-6 border-white/10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-lg font-semibold mb-3">{category}</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {items.map((item: any) => (
                  <AccordionItem key={item.id} value={item.id} className="border-white/10">
                    <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </Card>
      </div>
    </section>
  )
}
