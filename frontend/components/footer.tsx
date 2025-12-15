import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="relative border-t bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/blue-technology-wave-background.jpg')] bg-cover bg-center bg-no-repeat opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent dark:from-gray-900/40"></div>
      <div className="relative z-10 container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image 
                  src="/images/logo.png" 
                  alt="Opulon Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold">Opulon</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Modern healthcare e-commerce platform providing quality pharmaceutical products and medical supplies.
            </p>
            <div className="flex gap-2 mt-4">
              <div className="relative w-16 h-12 rounded overflow-hidden">
                <Image 
                  src="/images/10.png" 
                  alt="Healthcare" 
                  fill 
                  className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="relative w-16 h-12 rounded overflow-hidden">
                <Image 
                  src="/images/11.png" 
                  alt="Medical" 
                  fill 
                  className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="relative w-16 h-12 rounded overflow-hidden">
                <Image 
                  src="/images/12.png" 
                  alt="Technology" 
                  fill 
                  className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=pharmaceuticals" className="text-muted-foreground hover:text-foreground">
                  Pharmaceuticals
                </Link>
              </li>
              <li>
                <Link href="/products?category=medical-supplies" className="text-muted-foreground hover:text-foreground">
                  Medical Supplies
                </Link>
              </li>
              <li>
                <Link href="/products?category=equipment" className="text-muted-foreground hover:text-foreground">
                  Equipment
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-muted-foreground hover:text-foreground">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Opulon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}