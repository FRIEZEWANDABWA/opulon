"use client"

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionBackground } from '@/components/section-background'
import { api } from '@/lib/api'
import { useToast } from '@/lib/use-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      toast({
        title: "Error",
        description: "Invalid or missing reset token.",
        variant: "destructive",
      })
      router.push('/login')
    }
  }, [searchParams, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }
    if (!token) {
        toast({
            title: "Error",
            description: "No reset token found.",
            variant: "destructive",
        })
        return
    }

    setIsLoading(true)
    try {
      await api.resetPassword(token, password)
      setIsSubmitted(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to reset password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SectionBackground image="Healthcare Technology1.webp" overlay="blue" className="min-h-screen">
      <div className="container flex min-h-screen flex-col items-center justify-center py-6 px-4 sm:py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:space-y-8 sm:w-[400px]">
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
                Reset Your Password
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your new password below.
              </p>
            </div>
          </div>

          <Card className="shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">New Password</CardTitle>
              <CardDescription>
                Choose a strong password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center">
                  <p className="text-green-600">Your password has been reset successfully.</p>
                  <Link href="/login" className="text-blue-600 hover:underline mt-4 block">
                    Back to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 relative">
                    <label htmlFor="password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <div className="space-y-2 relative">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionBackground>
  )
}
