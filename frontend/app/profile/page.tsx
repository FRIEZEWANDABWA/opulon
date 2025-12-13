"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import { useToast } from '@/lib/use-toast'
import { ProtectedRoute } from '@/components/protected-route'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await api.getOrders()
        setOrders(userOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={user.full_name} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input value={user.username} disabled />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={user.email} disabled />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Role: <strong>{user.role}</strong></span>
                <span className="text-sm">Status: <strong>{user.is_active ? 'Active' : 'Inactive'}</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Your recent orders and purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders found</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/products'}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm">Status: <span className="font-medium">{order.status}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total_amount}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}