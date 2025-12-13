"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-2xl">
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
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="md:hidden">
              <span className="font-bold text-xl">Opulon</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    Orders
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                {user?.role === 'admin' || user?.role === 'superadmin' ? (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                ) : null}
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}