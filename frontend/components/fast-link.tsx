"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

interface FastLinkProps {
  href: string
  children: ReactNode
  className?: string
  prefetch?: boolean
  onClick?: () => void
}

export function FastLink({ href, children, className, prefetch = true, onClick }: FastLinkProps) {
  const router = useRouter()

  const handleMouseEnter = () => {
    if (prefetch) {
      router.prefetch(href)
    }
  }

  return (
    <Link 
      href={href} 
      className={className}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      onClick={onClick}
      prefetch={prefetch}
    >
      {children}
    </Link>
  )
}