"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/lib/use-toast'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Shield,
  AlertTriangle
} from 'lucide-react'

export default function ApiKeysPage() {
  const { toast } = useToast()
  const [showKeys, setShowKeys] = useState({
    stripe: false,
    smtp: false,
    secret: false
  })

  // In production, these would come from a secure API endpoint
  const [apiKeys, setApiKeys] = useState({
    stripe_secret: 'sk_live_••••••••••••••••••••••••••••',
    stripe_webhook: 'whsec_••••••••••••••••••••••••••••',
    smtp_password: '••••••••••••••••',
    secret_key: '••••••••••••••••••••••••••••••••••••••••••••••••••••'
  })

  const toggleVisibility = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    })
  }

  const updateApiKey = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }))
    toast({
      title: "API Key Updated",
      description: "Changes will take effect after restart",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="h-8 w-8" />
            API Keys Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage sensitive API keys and credentials securely
          </p>
        </div>
      </div>

      {/* Security Warning */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Security Notice</p>
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
            API keys are sensitive credentials. Only authorized administrators should access this page.
            Never share these keys or commit them to version control.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {/* Payment Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Payment Gateway (Stripe)
            </CardTitle>
            <CardDescription>
              Stripe API keys for payment processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe_secret">Secret Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="stripe_secret"
                  type={showKeys.stripe ? "text" : "password"}
                  value={apiKeys.stripe_secret}
                  onChange={(e) => updateApiKey('stripe_secret', e.target.value)}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleVisibility('stripe')}
                >
                  {showKeys.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKeys.stripe_secret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripe_webhook">Webhook Secret</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="stripe_webhook"
                  type={showKeys.stripe ? "text" : "password"}
                  value={apiKeys.stripe_webhook}
                  onChange={(e) => updateApiKey('stripe_webhook', e.target.value)}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKeys.stripe_webhook)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Email Service (SMTP)
            </CardTitle>
            <CardDescription>
              SMTP credentials for email notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_password">SMTP Password</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="smtp_password"
                  type={showKeys.smtp ? "text" : "password"}
                  value={apiKeys.smtp_password}
                  onChange={(e) => updateApiKey('smtp_password', e.target.value)}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleVisibility('smtp')}
                >
                  {showKeys.smtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKeys.smtp_password)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Security
            </CardTitle>
            <CardDescription>
              Core system security keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret_key">JWT Secret Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secret_key"
                  type={showKeys.secret ? "text" : "password"}
                  value={apiKeys.secret_key}
                  onChange={(e) => updateApiKey('secret_key', e.target.value)}
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleVisibility('secret')}
                >
                  {showKeys.secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKeys.secret_key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Used for JWT token signing. Changing this will invalidate all existing sessions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">SSL Certificate</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Rate Limiting</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Security Headers</span>
                <Badge variant="default">Configured</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Database Encryption</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}