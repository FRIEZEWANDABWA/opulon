"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionBackground } from '@/components/section-background'
import { api } from '@/lib/api'
import { useToast } from '@/lib/use-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await api.forgotPassword(email)
      setIsSubmitted(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send password reset email.",
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
                Forgot Your Password?
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your email to receive a reset link.
              </p>
            </div>
          </div>

          <Card className="shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>
                We'll send a password reset link to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center">
                  <p className="text-green-600">If an account with that email exists, a password reset link has been sent. Please check your inbox.</p>
                  <Link href="/login" className="text-blue-600 hover:underline mt-4 block">
                    Back to Login
                  </Link>
                </div>
              ) : (
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
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </SectionBackground>
  )
}
