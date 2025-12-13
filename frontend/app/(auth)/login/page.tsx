"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import { useToast } from '@/lib/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.login(email, password)
      login(response.user, response.access_token)
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      
      router.push('/')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Login failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container flex min-h-screen flex-col items-center justify-center py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
          {/* Logo and Branding */}
          <div className="flex flex-col space-y-4 text-center">
            <Link href="/" className="mx-auto">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-600 p-2">
                  <div className="h-6 w-6 rounded bg-white"></div>
                </div>
                <span className="text-2xl font-bold">Opulon</span>
              </div>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-muted-foreground mt-2">
                Sign in to your healthcare distribution account
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Sign In to Your Account</CardTitle>
              <CardDescription>
                Access your Opulon healthcare solutions dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              {/* Demo Information */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Getting Started:
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>• Create a new account to get started</div>
                  <div>• Contact admin for demo access</div>
                  <div>• Visit our documentation for setup guide</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to Opulon?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create your account
              </Link>
            </p>
          </div>

          {/* Additional Links */}
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="/business-solutions" className="hover:text-blue-600">
              Business Solutions
            </Link>
            <Link href="/contact" className="hover:text-blue-600">
              Contact Support
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}