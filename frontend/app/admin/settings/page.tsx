"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/lib/use-toast'
import { 
  Settings, 
  Save, 
  Database, 
  Mail, 
  Shield, 
  Bell,
  Globe,
  Palette
} from 'lucide-react'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'Opulon Healthcare',
    siteDescription: 'Modern Healthcare E-commerce Platform',
    adminEmail: 'admin@opulon.com',
    enableRegistration: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxOrderAmount: 10000,
    taxRate: 8.5,
    shippingFee: 15.99
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your application settings and configuration
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic site configuration and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Access
            </CardTitle>
            <CardDescription>
              Control user access and security features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to create accounts
                </p>
              </div>
              <Switch
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => updateSetting('enableRegistration', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable site access
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* E-commerce Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              E-commerce Settings
            </CardTitle>
            <CardDescription>
              Configure pricing and order settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxOrderAmount">Max Order Amount ($)</Label>
              <Input
                id="maxOrderAmount"
                type="number"
                value={settings.maxOrderAmount}
                onChange={(e) => updateSetting('maxOrderAmount', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Default Shipping Fee ($)</Label>
              <Input
                id="shippingFee"
                type="number"
                step="0.01"
                value={settings.shippingFee}
                onChange={(e) => updateSetting('shippingFee', parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive system notifications
                </p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Version</p>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Environment</p>
              <p className="text-sm text-muted-foreground">Development</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Database</p>
              <p className="text-sm text-muted-foreground">PostgreSQL 15</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}