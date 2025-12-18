"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { FastLink } from "@/components/fast-link"
import { api } from "@/lib/api"

interface ProductImage {
  id: number
  image_url: string
  alt_text: string
  is_primary: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock_quantity: number
  manufacturer?: string
  dosage?: string
  is_prescription_required: boolean
  images: ProductImage[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const data = await api.getProduct(productId)
      setProduct(data)
      if (data.images.length > 0) {
        const primaryImage = data.images.find((img: ProductImage) => img.is_primary) || data.images[0]
        setSelectedImage(`/api/image${primaryImage.image_url}`)
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container mx-auto p-6">Loading...</div>
  if (!product) return <div className="container mx-auto p-6">Product not found</div>

  return (
    <div className="container mx-auto p-6">
      <FastLink href="/products" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </FastLink>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            <img
              src={selectedImage || '/images/placeholder-product.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/placeholder-product.svg'
              }}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(`/api/image${image.image_url}`)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === `/api/image${image.image_url}` 
                      ? 'border-blue-500' 
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`/api/image${image.image_url}`}
                    alt={image.alt_text}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-product.svg'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.manufacturer && (
              <p className="text-gray-600">by {product.manufacturer}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
            {product.dosage && (
              <Badge variant="outline">{product.dosage}</Badge>
            )}
            {product.is_prescription_required && (
              <Badge variant="destructive">Prescription Required</Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className={`text-lg font-medium ${
              product.stock_quantity <= 0 ? 'text-red-600' :
              product.stock_quantity <= 10 ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {product.stock_quantity > 0 
                ? `${product.stock_quantity} in stock`
                : 'Out of stock'
              }
            </div>
            {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
              <p className="text-orange-600 text-sm">Only a few left!</p>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full"
            disabled={product.stock_quantity <= 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}