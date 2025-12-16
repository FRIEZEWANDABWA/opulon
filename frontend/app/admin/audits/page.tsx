"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Search, 
  Calendar,
  User,
  Package
} from 'lucide-react'

interface AuditLog {
  id: number
  action: string
  entity_type: string
  entity_id: number
  user_id: number
  user_name: string
  changes: any
  timestamp: string
  ip_address?: string
}

export default function AdminAuditsPage() {
  const [audits, setAudits] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterAction, setFilterAction] = useState('all')

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = async () => {
    try {
      const { api } = await import('@/lib/api')
      const auditData = await api.getAuditLogs()
      setAudits(auditData)
    } catch (error) {
      console.error('Failed to fetch audits:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = 
      audit.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || audit.entity_type.toLowerCase() === filterType.toLowerCase()
    const matchesAction = filterAction === 'all' || audit.action.toLowerCase() === filterAction.toLowerCase()
    
    return matchesSearch && matchesType && matchesAction
  })

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case 'user':
        return <User className="h-4 w-4" />
      case 'product':
        return <Package className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatChanges = (changes: any) => {
    if (!changes) return 'No details'
    
    return Object.entries(changes).map(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value.from && value.to) {
        return `${key}: ${value.from} → ${value.to}`
      }
      return `${key}: ${value}`
    }).join(', ')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-10 bg-muted rounded" />
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all system changes and modifications
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audits.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Changes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter(a => a.entity_type === 'USER').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Changes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter(a => a.entity_type === 'PRODUCT').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {audits.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white text-gray-900 min-w-[120px]"
        >
          <option value="all">All Types</option>
          <option value="user">Users</option>
          <option value="product">Products</option>
        </select>
        <select 
          value={filterAction} 
          onChange={(e) => setFilterAction(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white text-gray-900 min-w-[120px]"
        >
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs ({filteredAudits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAudits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs found matching your filters.
              </div>
            ) : (
              filteredAudits.map((audit) => (
                <div key={audit.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getEntityIcon(audit.entity_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getActionBadgeColor(audit.action)}>
                          {audit.action}
                        </Badge>
                        <Badge variant="outline">
                          {audit.entity_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by {audit.user_name}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {audit.action} {audit.entity_type.toLowerCase()} #{audit.entity_id}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Changes: {formatChanges(audit.changes)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(audit.timestamp).toLocaleString()}
                        </span>
                        {audit.ip_address && (
                          <span>IP: {audit.ip_address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}