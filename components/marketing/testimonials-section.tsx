import { createClient } from '@/lib/supabase/server'
import { TestimonialCards } from '@/components/shared/testimonial-cards'

export async function TestimonialsSection() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, profiles!inner(full_name, avatar_url)')
    .eq('is_approved', true)
    .order('display_order', { ascending: true })
    .limit(6)

  if (!testimonials?.length) return null

  return <TestimonialCards testimonials={testimonials} />
}
