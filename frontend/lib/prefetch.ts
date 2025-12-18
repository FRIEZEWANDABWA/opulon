import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Prefetch critical pages on app load
export const usePrefetchCriticalPages = () => {
  const router = useRouter()

  useEffect(() => {
    // Prefetch most visited pages
    const criticalPages = [
      '/products',
      '/login',
      '/register',
      '/cart',
      '/about'
    ]

    criticalPages.forEach(page => {
      router.prefetch(page)
    })
  }, [router])
}

// Prefetch on hover for better UX
export const prefetchOnHover = (href: string) => {
  const router = useRouter()
  return {
    onMouseEnter: () => router.prefetch(href),
    onTouchStart: () => router.prefetch(href)
  }
}