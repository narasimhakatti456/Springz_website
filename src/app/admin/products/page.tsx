'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Plus, Search, Edit, Trash2, Eye, RefreshCw, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { useRealTimeProducts } from '@/hooks/useRealTimeData'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  images: string
  features: string
  category: {
    name: string
  }
  variants: {
    id: string
    size: string
    flavor: string | null
    priceInINR: number
    stock: number
    isActive: boolean
  }[]
  createdAt: string
}

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { 
    data: productsData, 
    loading, 
    error, 
    lastUpdated, 
    refresh 
  } = useRealTimeProducts()

  const products = (productsData as any)?.products || []

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh data after deletion
        refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Something went wrong')
    }
  }

  const filteredProducts = products.filter((product: any) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Manage your product catalog</p>
            {lastUpdated && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => {
          const images = product.images.split(',').filter(Boolean)
          const defaultVariant = product.variants.find((v: any) => v.isActive) || product.variants[0]
          const features = product.features.split(',').filter(Boolean)

          return (
            <Card key={product.id}>
              <div className="relative h-48">
                <Image
                  src={images[0] || '/placeholder-product.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-white">
                    {product.category.name}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span className="font-medium">
                      {defaultVariant ? formatPrice(defaultVariant.priceInINR) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stock:</span>
                    <span className="font-medium">
                      {defaultVariant ? defaultVariant.stock : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Variants:</span>
                    <span className="font-medium">{product.variants.length}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/product/${product.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}
