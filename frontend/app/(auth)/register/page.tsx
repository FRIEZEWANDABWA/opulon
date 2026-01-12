"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionBackground } from '@/components/section-background'
import { api } from '@/lib/api'
import { useToast } from '@/lib/use-toast'
import { Check, X, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
    const { toast } = useToast()
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'password') {
      validatePassword(value)
    }
  }

  const validatePassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    })
  }

    useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await api.resendVerificationEmail(formData.email);
      toast({
        title: "Success",
        description: "A new verification email has been sent. Please check your inbox.",
      });
      setResendCooldown(60);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.full_name || !formData.username || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (Object.values(passwordValidation).some(v => !v)) {
      toast({
        title: "Error",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      })
      return
    }


    setIsLoading(true)

    try {
      const { confirmPassword, ...userData } = formData
      await api.register(userData)
      setRegistrationSuccess(true);
    } catch (error: any) {
      const errorDetail = error.response?.data?.detail;
      let errorMessage = "Registration failed";

      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map((err: any) => err.msg).join(', ');
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SectionBackground image="Healthcare Technology3.png" overlay="green" className="min-h-screen">
      <div className="container flex min-h-screen flex-col items-center justify-center py-6 px-4 sm:py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
          {registrationSuccess ? (
            <Card className="shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl">Registration Successful</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Thank you for registering. A verification link has been sent to your email address. Please check your inbox to complete the process.
                </p>
                                <div className="mt-6 text-center space-y-4">
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700"
                      onClick={handleResendVerification}
                      disabled={isResending || resendCooldown > 0}
                    >
                      {isResending
                        ? "Sending..."
                        : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend verification email"}
                    </Button>
                  </div>
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your details to create your account
                </p>
              </div>
              <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create your Opulon account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} method="POST" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="full_name" className="text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username *
                    </label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, State"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Password must contain:
                      <ul>
                        <li className={`flex items-center ${passwordValidation.length ? 'text-green-500' : ''}`}>
                          {passwordValidation.length ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />} At least 8 characters
                        </li>
                        <li className={`flex items-center ${passwordValidation.uppercase ? 'text-green-500' : ''}`}>
                          {passwordValidation.uppercase ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />} At least one uppercase letter
                        </li>
                        <li className={`flex items-center ${passwordValidation.lowercase ? 'text-green-500' : ''}`}>
                          {passwordValidation.lowercase ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />} At least one lowercase letter
                        </li>
                        <li className={`flex items-center ${passwordValidation.number ? 'text-green-500' : ''}`}>
                          {passwordValidation.number ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />} At least one number
                        </li>
                        <li className={`flex items-center ${passwordValidation.special ? 'text-green-500' : ''}`}>
                          {passwordValidation.special ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />} At least one special character
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
          </>
          )}
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </SectionBackground>
  )
}