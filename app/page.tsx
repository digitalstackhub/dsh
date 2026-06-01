import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { HeroSection } from '@/components/marketing/hero-section'
import { StatsSection } from '@/components/marketing/stats-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { TestimonialsSection } from '@/components/marketing/testimonials-section'
import { PricingSection } from '@/components/marketing/pricing-section'
import { FaqSection } from '@/components/marketing/faq-section'
import { NewsletterSection } from '@/components/marketing/newsletter-section'
import { FooterSection } from '@/components/marketing/footer-section'
import { AnnouncementBanner } from '@/components/shared/announcement-banner'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch active announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Announcement Banner */}
      {announcements?.map((a: any) => (
        <AnnouncementBanner key={a.id} announcement={a} />
      ))}

      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Skeleton className="h-96 w-full max-w-4xl rounded-3xl" /></div>}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-32 rounded-2xl mx-8" />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-3 gap-6 p-8"><Skeleton className="h-40" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64 rounded-2xl mx-8" />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-3 gap-6 p-8"><Skeleton className="h-80" /><Skeleton className="h-80" /><Skeleton className="h-80" /></div>}>
        <PricingSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64 rounded-2xl mx-8" />}>
        <FaqSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-32 rounded-2xl mx-8" />}>
        <NewsletterSection />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64 rounded-2xl mx-8" />}>
        <FooterSection />
      </Suspense>
    </div>
  )
}
