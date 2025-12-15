"use client"

import { ReactNode } from "react"

interface SectionBackgroundProps {
  children: ReactNode
  image: string
  overlay?: "light" | "dark" | "blue" | "green" | "purple" | "orange" | "red" | "teal"
  className?: string
}

export function SectionBackground({ 
  children, 
  image, 
  overlay = "dark", 
  className = "" 
}: SectionBackgroundProps) {
  const overlayClasses = {
    light: "bg-gradient-to-br from-white/70 via-white/60 to-white/70 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/80",
    dark: "bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 dark:from-black/85 dark:via-black/75 dark:to-black/85",
    blue: "bg-gradient-to-br from-blue-50/70 via-blue-100/60 to-blue-50/70 dark:from-blue-900/80 dark:via-blue-800/70 dark:to-blue-900/80",
    green: "bg-gradient-to-br from-green-50/70 via-green-100/60 to-green-50/70 dark:from-green-900/80 dark:via-green-800/70 dark:to-green-900/80",
    purple: "bg-gradient-to-br from-purple-50/70 via-purple-100/60 to-purple-50/70 dark:from-purple-900/80 dark:via-purple-800/70 dark:to-purple-900/80",
    orange: "bg-gradient-to-br from-orange-50/70 via-orange-100/60 to-orange-50/70 dark:from-orange-900/80 dark:via-orange-800/70 dark:to-orange-900/80",
    red: "bg-gradient-to-br from-red-50/70 via-red-100/60 to-red-50/70 dark:from-red-900/80 dark:via-red-800/70 dark:to-red-900/80",
    teal: "bg-gradient-to-br from-teal-50/70 via-teal-100/60 to-teal-50/70 dark:from-teal-900/80 dark:via-teal-800/70 dark:to-teal-900/80"
  }

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700 hover:scale-110"
        style={{ backgroundImage: `url('/images/${image}')` }}
      />
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}