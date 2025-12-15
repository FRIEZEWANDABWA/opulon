"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useState } from "react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image 
                src="/images/logo.png" 
                alt="Opulon Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl lg:text-2xl">
              Opulon
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/business-solutions"
              prefetch={true}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Business Solutions
            </Link>
            <Link
              href="/products"
              prefetch={true}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Products
            </Link>
            <Link
              href="/pharmacy-services"
              prefetch={true}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pharmacy Services
            </Link>
            <Link
              href="/about"
              prefetch={true}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About Us
            </Link>
          </nav>
        </div>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="md:hidden flex items-center space-x-2">
              <div className="relative w-7 h-7">
                <Image 
                  src="/images/logo.png" 
                  alt="Opulon Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">Opulon</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/orders" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Orders
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                {user?.role === 'admin' || user?.role === 'superadmin' ? (
                  <Link href="/admin" className="hidden sm:block">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                ) : null}
                <Button variant="outline" size="sm" onClick={logout} className="px-2 sm:px-3">
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="px-2 sm:px-3">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <div className="container py-4 space-y-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/business-solutions"
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Business Solutions
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/pharmacy-services"
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pharmacy Services
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    href="/orders"
                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'superadmin') && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-fit"
                  >
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}