"use client"

import Image from "next/image"
import { useState } from "react"

const healthcareImages = [
  "/images/5.png",
  "/images/6.png", 
  "/images/7.png",
  "/images/8.png",
  "/images/9.png",
  "/images/13.png",
  "/images/14.png",
  "/images/15.png"
]

export function ImageGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 z-10"></div>
      <Image
        src={healthcareImages[currentIndex]}
        alt="Healthcare Technology"
        fill
        className="object-cover transition-all duration-500"
        onLoad={() => {
          // Auto-rotate images
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % healthcareImages.length)
          }, 3000)
        }}
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {healthcareImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}