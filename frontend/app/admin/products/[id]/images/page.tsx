"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  images: ProductImage[]
}

export default function ProductImagesPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  const [product, setProduct] = useState<Product | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const data = await api.getProduct(productId)
      setProduct(data)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch(`http://localhost:8000/api/v1/admin/products/${productId}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      })

      if (response.ok) {
        await fetchProduct()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    try {
      await api.deleteProductImage(productId, imageId)
      await fetchProduct()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Images for {product.name}</h1>
      
      <div className="mb-6">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="mb-4"
        />
        {uploading && <p>Uploading...</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {product.images.map((image) => (
          <Card key={image.id} className="p-4">
            <div className="aspect-square mb-3 relative">
              <img
                src={`/api/image${image.image_url}`}
                alt={image.alt_text}
                className="w-full h-full object-cover rounded"
              />
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  Primary
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">ID: {image.id}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(image.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {product.images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No images uploaded yet.
        </div>
      )}
      
      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Total images: {product.images.length}
        </p>
      </div>
    </div>
  )
}