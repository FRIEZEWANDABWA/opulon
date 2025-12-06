"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Package, ArrowLeft, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/lib/use-toast'
import { api } from '@/lib/api'

interface Product {
  id: number
  name: string
  description: string
  price: number | string
  sku: string
  stock_quantity: number
  image_url?: string
  is_prescription_required: boolean
  manufacturer?: string
  dosage?: string
  category?: {
    id: number
    name: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchProduct(parseInt(params.id as string))
    }
  }, [params.id])

  const fetchProduct = async (id: number) => {
    setLoading(true)
    try {
      const data = await api.getProduct(id)
      setProduct(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      })
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Temporarily disabled auth check for testing
    // if (!isAuthenticated) {
    //   toast({
    //     title: "Login Required",
    //     description: "Please login to add items to cart",
    //     variant: "destructive",
    //   })
    //   return
    // }

    if (quantity > product.stock_quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock_quantity} items available`,
        variant: "destructive",
      })
      return
    }

    setAddingToCart(true)
    try {
      await api.addToCart(product.id, quantity)
      
      // Add to local store
      addItem({
        id: Date.now(),
        product_id: product.id,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        }
      })

      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 0)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.is_prescription_required && (
                  <Badge variant="secondary">Prescription Required</Badge>
                )}
              </div>
              {product.manufacturer && (
                <p className="text-muted-foreground">by {product.manufacturer}</p>
              )}
              {product.category && (
                <p className="text-sm text-muted-foreground">
                  Category: {product.category.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold">${parseFloat(product.price.toString()).toFixed(2)}</div>
              <div className="flex items-center gap-4 text-sm">
                <span>SKU: {product.sku}</span>
                <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock_quantity > 0 
                    ? `${product.stock_quantity} in stock` 
                    : 'Out of stock'
                  }
                </span>
              </div>
              {product.dosage && (
                <p className="text-sm text-muted-foreground">
                  Dosage: {product.dosage}
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (val >= 1 && val <= product.stock_quantity) {
                        setQuantity(val)
                      }
                    }}
                    className="w-20 text-center"
                    min={1}
                    max={product.stock_quantity}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => adjustQuantity(1)}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || addingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addingToCart 
                  ? 'Adding to Cart...' 
                  : product.stock_quantity === 0 
                    ? 'Out of Stock' 
                    : `Add to Cart - $${(parseFloat(product.price.toString()) * quantity).toFixed(2)}`
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}