"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/lib/use-toast'
import { api } from '@/lib/api'
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react'

interface Photo {
  id: number
  url: string
  is_main: boolean
}

interface PhotoUploadProps {
  productId: number
  photos: Photo[]
  onPhotosChange: (photos: Photo[]) => void
}

export default function PhotoUpload({ productId, photos, onPhotosChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < Math.min(files.length, 3 - photos.length); i++) {
        const file = files[i]
        const isMain = photos.length === 0 && i === 0
        
        const newPhoto = await api.uploadProductPhoto(productId, file, isMain)
        onPhotosChange([...photos, newPhoto])
      }
      
      toast({
        title: "Success",
        description: "Photos uploaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (photoId: number) => {
    try {
      await api.deleteProductPhoto(productId, photoId)
      const updatedPhotos = photos.filter(p => p.id !== photoId)
      onPhotosChange(updatedPhotos)
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleSetMain = async (photoId: number) => {
    try {
      await api.setMainPhoto(productId, photoId)
      const updatedPhotos = photos.map(p => ({
        ...p,
        is_main: p.id === photoId
      }))
      onPhotosChange(updatedPhotos)
      
      toast({
        title: "Success",
        description: "Main photo updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Photos</h3>
        {photos.length < 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Add Photos'}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="relative">
            <CardContent className="p-4">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                {photo.is_main && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Main
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {!photo.is_main && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetMain(photo.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(photo.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {photos.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No photos uploaded</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload First Photo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Upload up to 3 photos. The first photo will be set as the main photo automatically.
      </p>
    </div>
  )
}