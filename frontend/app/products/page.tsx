"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductCard } from '@/components/product-card'
import { ProductGridSkeleton } from '@/components/product-skeleton'
import { SectionBackground } from '@/components/section-background'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/lib/use-toast'

interface Product {
  id: number
  name: string
  description: string
  price: number | string
  image_url?: string
  stock_quantity: number
  is_prescription_required: boolean
  manufacturer?: string
  category?: {
    id: number
    name: string
  }
}

interface Category {
  id: number
  name: string
  description?: string
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    if (category) {
      const categoryId = parseInt(category)
      setSelectedCategory(categoryId)
    }
    if (search) {
      setSearchTerm(search)
    }
    
    fetchProducts()
  }, [searchParams, currentPage])

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      }

      const data = await api.getProducts(params)
      setProducts(data)
      
      // Calculate total pages (this would come from API in real implementation)
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
    fetchProducts()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <SectionBackground image="6.png" overlay="blue">
        <div className="container py-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Browse our comprehensive catalog of pharmaceutical products and medical supplies
            </p>
          </div>
        </div>
      </SectionBackground>

      {/* Search and Filters */}
      <SectionBackground image="17.jpeg" overlay="light">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 space-y-6">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === null ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCategoryFilter(null)}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleCategoryFilter(category.id)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Search</Button>
              </form>

              {/* Results Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${products.length} products found`}
                </p>
              </div>

              {/* Products Grid */}
              {loading ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} showImages={true} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className="flex space-x-1 sm:space-x-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="flex-shrink-0 w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex-shrink-0"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionBackground>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  )
}