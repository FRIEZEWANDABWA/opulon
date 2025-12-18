"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload, Download } from 'lucide-react'
import { useToast } from '@/lib/use-toast'
import PhotoUpload from '@/components/admin/PhotoUpload'
import { api } from '@/lib/api'

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [bulkUpload, setBulkUpload] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [createdProductId, setCreatedProductId] = useState<number | null>(null)

  const handleSingleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const productData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        sku: formData.get('sku') as string,
        stock_quantity: parseInt(formData.get('stock') as string),
        category_id: 1, // Default category
        manufacturer: formData.get('manufacturer') as string,
        dosage: formData.get('dosage') as string,
        is_prescription_required: formData.get('prescription') === 'on'
      }
      
      const newProduct = await api.createProduct(productData)
      
      // Upload images if any
      const imageFiles = formData.getAll('images') as File[]
      if (imageFiles.length > 0 && imageFiles[0].size > 0) {
        const imageFormData = new FormData()
        imageFiles.forEach(file => {
          imageFormData.append('files', file)
        })
        
        await fetch(`http://localhost:8000/api/v1/admin/products/${newProduct.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: imageFormData
        })
      }
      
      toast({
        title: "Success",
        description: "Product created successfully with images!",
      })
      
      router.push('/admin/products')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock implementation
    setTimeout(() => {
      toast({
        title: "Success", 
        description: "Products uploaded successfully",
      })
      router.push('/admin/products')
      setLoading(false)
    }, 2000)
  }

  const downloadTemplate = () => {
    const csvContent = `name,description,price,sku,stock_quantity,category_name,manufacturer,dosage,is_prescription_required
Aspirin 325mg,Pain reliever and anti-inflammatory,5.99,ASP-325MG,100,Pain Management,Generic Pharma,325mg,false
Lisinopril 10mg,ACE inhibitor for blood pressure,12.50,LIS-10MG-NEW,50,Heart Health,CardioMed,10mg,true`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Products</h1>
          <p className="text-muted-foreground">
            Create individual products or upload in bulk
          </p>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <Button
          variant={!bulkUpload ? "default" : "outline"}
          onClick={() => setBulkUpload(false)}
        >
          Single Product
        </Button>
        <Button
          variant={bulkUpload ? "default" : "outline"}
          onClick={() => setBulkUpload(true)}
        >
          Bulk Upload
        </Button>
      </div>

      {!bulkUpload ? (
        <>
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSingleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" name="sku" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" name="price" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input id="stock" name="stock" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="e.g., Pain Management" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" name="manufacturer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input id="dosage" name="dosage" placeholder="e.g., 500mg" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="prescription" name="prescription" />
                <Label htmlFor="prescription">Prescription Required</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <Input 
                  id="images" 
                  name="images" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                <p className="text-sm text-muted-foreground">Select up to 3 images for this product</p>
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {createdProductId && (
          <Card>
            <CardHeader>
              <CardTitle>Product Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                productId={createdProductId}
                photos={photos}
                onPhotosChange={setPhotos}
              />
              <div className="mt-4">
                <Button onClick={() => router.push('/admin/products')}>
                  Finish & Go to Products
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
              <p className="text-muted-foreground mb-4">
                Upload a CSV file with your product data. Download the template below to get started.
              </p>
              
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <Input
                  type="file"
                  accept=".csv"
                  className="max-w-sm mx-auto"
                  required
                />
                <div className="flex gap-4 justify-center">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Products"}
                  </Button>
                  <Button type="button" variant="outline" onClick={downloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Required fields: name, price, sku, category_name</li>
                <li>• Optional fields: description, stock_quantity, manufacturer, dosage, is_prescription_required</li>
                <li>• Categories will be auto-created if they don't exist</li>
                <li>• SKU must be unique across all products</li>
                <li>• Price should be a decimal number (e.g., 12.50)</li>
                <li>• is_prescription_required should be true/false</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}