"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.healthCheck()
        setBackendStatus('online')
      } catch (error) {
        setBackendStatus('offline')
      }
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check initial connection
    checkConnection()

    // Set up periodic health checks
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline && backendStatus === 'online') {
    return null // Don't show anything when everything is working
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardContent className="flex items-center gap-2 p-3">
          {!isOnline ? (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-300">No internet connection</span>
            </>
          ) : backendStatus === 'offline' ? (
            <>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700 dark:text-orange-300">Backend unavailable</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-700 dark:text-blue-300">Checking connection...</span>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}