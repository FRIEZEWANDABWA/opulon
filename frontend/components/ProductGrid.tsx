"use client"

import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { FastLink } from "@/components/fast-link"
import { api } from "@/lib/api"

interface Product {
  id: number
  name: string
  description: string
  price: number
  sku: string
  stock_quantity: number
  stock_status: string
  is_available: boolean
  manufacturer?: string
  dosage?: string
  is_prescription_required: boolean
  images: Array<{
    id: number
    image_url: string
    alt_text: string
    is_primary: boolean
  }>
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductImage = (product: Product) => {
    const primaryImage = product.images.find(img => img.is_primary)
    if (!primaryImage) return '/images/placeholder-product.svg'
    return `/api/image${primaryImage.image_url}`
  }

  const getStockBadge = (product: Product) => {
    if (product.stock_status === 'out_of_stock') {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.stock_status === 'low_stock') {
      return <Badge variant="secondary">Low Stock</Badge>
    }
    return <Badge variant="default">In Stock</Badge>
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/placeholder-product.svg'
              }}
            />
            {product.is_prescription_required && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                Rx Required
              </div>
            )}
            <div className="absolute top-2 left-2">
              {getStockBadge(product)}
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            
            {product.manufacturer && (
              <p className="text-xs text-gray-500 mb-2">by {product.manufacturer}</p>
            )}
            
            {product.dosage && (
              <p className="text-xs text-blue-600 mb-2">{product.dosage}</p>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  product.stock_quantity <= 0 ? 'text-red-600' :
                  product.stock_quantity <= 10 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {product.stock_quantity} in stock
                </span>
                {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                  <div className="text-xs text-orange-600">Low Stock!</div>
                )}
                {product.stock_quantity <= 0 && (
                  <div className="text-xs text-red-600">Out of Stock</div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <FastLink href={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </FastLink>
              
              <Button 
                className="flex-1" 
                size="sm"
                disabled={!product.is_available || product.stock_quantity <= 0}
                variant={product.stock_quantity <= 0 ? "secondary" : "default"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}