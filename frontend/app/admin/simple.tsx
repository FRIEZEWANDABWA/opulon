'use client'

import { useState, useEffect } from 'react'

export default function SimpleAdmin() {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Set a test token for admin access
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiZXhwIjoxNzY1ODkxOTMwfQ.HmgzezLvUbqOTSaJfxQqhndr5QRWqZlFnmRFUCguogI'
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [usersRes, productsRes, statsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/admin/users', { headers }),
        fetch('http://localhost:8000/api/v1/admin/products', { headers }),
        fetch('http://localhost:8000/api/v1/admin/dashboard', { headers })
      ])

      setUsers(await usersRes.json())
      setProducts(await productsRes.json())
      setStats(await statsRes.json())

    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading admin data...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Simple Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total_users || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active_users || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Total Products</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.total_products || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Admin Users</h3>
          <p className="text-2xl font-bold text-red-600">{stats.admin_users || 0}</p>
        </div>
      </div>

      {/* Users */}
      <div className="bg-white rounded shadow mb-8">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Users ({users.length})</h2>
        </div>
        <div className="p-4">
          {users.slice(0, 5).map((user: any) => (
            <div key={user.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="font-medium">{user.full_name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="text-sm">
                <span className={`px-2 py-1 rounded ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        </div>
        <div className="p-4">
          {products.slice(0, 5).map((product: any) => (
            <div key={product.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">{product.sku}</div>
              </div>
              <div className="text-sm">
                <div>${product.price}</div>
                <div className="text-gray-500">Stock: {product.stock_quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}