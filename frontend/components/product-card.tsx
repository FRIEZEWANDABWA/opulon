"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/lib/use-toast'
import { api } from '@/lib/api'

interface Product {
  id: number
  name: string
  description: string
  price: number | string
  image_url?: string
  stock_quantity: number
  is_prescription_required: boolean
  manufacturer?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    // Temporarily disabled auth check for testing
    // if (!isAuthenticated) {
    //   toast({
    //     title: "Login Required",
    //     description: "Please login to add items to cart",
    //     variant: "destructive",
    //   })
    //   return
    // }

    try {
      await api.addToCart(product.id, 1)
      
      // Add to local store
      addItem({
        id: Date.now(), // Temporary ID
        product_id: product.id,
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        }
      })

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold line-clamp-2 hover:text-primary">
                {product.name}
              </h3>
            </Link>
            {product.is_prescription_required && (
              <Badge variant="secondary" className="text-xs">
                Rx
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          {product.manufacturer && (
            <p className="text-xs text-muted-foreground">
              by {product.manufacturer}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              ${parseFloat(product.price.toString()).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              Stock: {product.stock_quantity}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}