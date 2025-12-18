"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, Edit, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

interface ProductImage {
  id: number
  image_url: string
  alt_text: string
  is_primary: boolean
  display_order: number
}

interface ProductImageManagerProps {
  productId: number
  images: ProductImage[]
  onImagesChange: (images: ProductImage[]) => void
}

export function ProductImageManager({ productId, images, onImagesChange }: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return
    
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
        const result = await response.json()
        onImagesChange([...images, ...result.images])
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
      onImagesChange(images.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Images</h3>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Drag & drop images here, or click to select
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Select Images'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Supports: JPG, PNG, WebP, AVIF, GIF (Max 3 images)
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Card key={image.id} className="p-4">
            <div className="relative aspect-square mb-3">
              <img
                src={`/api/image${image.image_url}`}
                alt={image.alt_text}
                className="w-full h-full object-cover rounded-md"
              />
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  Primary
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Image {index + 1}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No images uploaded yet. Add some images to showcase this product.
        </div>
      )}
    </div>
  )
}