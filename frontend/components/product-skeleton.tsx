import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted animate-pulse" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-5 bg-muted rounded w-16 animate-pulse" />
            <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-8 bg-muted rounded w-full animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}