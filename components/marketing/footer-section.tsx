import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export async function FooterSection() {
  const supabase = await createClient()

  const { data: footerLinks } = await supabase
    .from('footer_links')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  // Group by section
  const grouped: Record<string, any[]> = {}
  footerLinks?.forEach((link: any) => {
    const section = link.section || 'other'
    if (!grouped[section]) grouped[section] = []
    grouped[section].push(link)
  })

  return (
    <footer className="border-t border-white/5 bg-dark-800/50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Gradient Divider */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full mb-12 opacity-30" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              DigitalStackHub
            </h4>
            <p className="text-sm text-muted-foreground">
              Premium digital resources for creators and developers.
            </p>
          </div>
          {Object.entries(grouped).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-4">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h4>
              <ul className="space-y-2">
                {links.map((link: any) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DigitalStackHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> for creators
          </p>
        </div>
      </div>
    </footer>
  )
}
