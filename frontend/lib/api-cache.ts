// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const apiCache = {
  get: (key: string) => {
    const item = cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.timestamp + item.ttl) {
      cache.delete(key)
      return null
    }
    
    return item.data
  },
  
  set: (key: string, data: any, ttl: number = 30000) => { // 30 seconds default
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  },
  
  clear: () => {
    cache.clear()
  }
}