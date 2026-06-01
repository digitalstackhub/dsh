import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Eye, Star } from 'lucide-react'

export function ResourceGrid({ resources }: { resources: any[] }) {
  if (!resources.length) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No resources found.</p>
        <p className="text-sm text-muted-foreground/60 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, i) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          viewport={{ once: true }}
        >
          <Link href={/resources/}>
            <Card className="h-full border-white/10 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-dark-800 to-dark-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="info" className="text-xs">
                    {resource.resource_categories?.name || 'Uncategorized'}
                  </Badge>
                </div>
                {resource.is_featured && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="warning" className="text-xs">Featured</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {resource.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {resource.file_size && <span>{resource.file_size}</span>}
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" /> {resource.download_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {resource.view_count || 0}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-foreground font-medium">
                    {resource.points_required || 0} pts
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
