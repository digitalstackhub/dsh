import { createClient } from '@/lib/supabase/server'
import { PricingCard } from '@/components/shared/pricing-card'
import { getSetting } from '@/lib/database/settings'

export async function PricingSection() {
  const supabase = await createClient()
  const currency = (await getSetting('default_currency')) || 'USD'

  // Fetch all active plans ordered by display_order
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (!plans?.length) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Choose Your{' '}
            <span className="text-gradient">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing for every need. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan: any) => (
            <PricingCard key={plan.id} plan={plan} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  )
}
