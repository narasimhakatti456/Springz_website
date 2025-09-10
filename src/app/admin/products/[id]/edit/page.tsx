'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Plus, 
  Trash2, 
  Package,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'

interface ProductVariant {
  id?: string
  size: string
  flavor: string | null
  priceInINR: number
  originalPriceInINR: number | null
  stock: number
  isActive: boolean
}

interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  images: string
  features: string
  ingredients: string
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  variants: ProductVariant[]
  nutritionFacts: Record<string, string>
  usageInstructions: string
  sciencePoints: string
  faq: Array<{ question: string; answer: string }>
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    size: '',
    flavor: '',
    priceInINR: 0,
    originalPriceInINR: null,
    stock: 0,
    isActive: true
  })

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchCategories()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        setMessage({ type: 'error', text: 'Product not found' })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setMessage({ type: 'error', text: 'Failed to load product' })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const saveProduct = async () => {
    if (!product) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Failed to update product' })
      }
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = (field: string, value: any) => {
    if (!product) return
    setProduct({ ...product, [field]: value })
  }

  const addVariant = () => {
    if (!product || !newVariant.size || !newVariant.priceInINR) return
    
    const variant: ProductVariant = {
      ...newVariant,
      id: `temp-${Date.now()}`
    }
    
    setProduct({
      ...product,
      variants: [...product.variants, variant]
    })
    
    setNewVariant({
      size: '',
      flavor: '',
      priceInINR: 0,
      originalPriceInINR: null,
      stock: 0,
      isActive: true
    })
  }

  const removeVariant = (variantId: string) => {
    if (!product) return
    setProduct({
      ...product,
      variants: product.variants?.filter(v => v.id !== variantId) || []
    })
  }

  const updateVariant = (variantId: string, field: string, value: any) => {
    if (!product) return
    setProduct({
      ...product,
      variants: product.variants?.map(v => 
        v.id === variantId ? { ...v, [field]: value } : v
      ) || []
    })
  }

  const addFAQ = () => {
    if (!product) return
    setProduct({
      ...product,
      faq: [...product.faq, { question: '', answer: '' }]
    })
  }

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    if (!product) return
    const updatedFAQ = [...product.faq]
    updatedFAQ[index] = { ...updatedFAQ[index], [field]: value }
    setProduct({ ...product, faq: updatedFAQ })
  }

  const removeFAQ = (index: number) => {
    if (!product) return
    setProduct({
      ...product,
      faq: product.faq?.filter((_, i) => i !== index) || []
    })
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'images', label: 'Images' },
    { id: 'variants', label: 'Variants' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'content', label: 'Content' },
    { id: 'faq', label: 'FAQ' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Product
            </h1>
            <p className="text-gray-600">{product.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {message && (
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
          <Button onClick={saveProduct} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-springz-light-green text-springz-green border-r-2 border-springz-green'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                {tabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <Input
                        value={product.title}
                        onChange={(e) => updateProduct('title', e.target.value)}
                        placeholder="Enter product title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={product.categoryId}
                        onChange={(e) => updateProduct('categoryId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <Input
                        value={product.shortDescription}
                        onChange={(e) => updateProduct('shortDescription', e.target.value)}
                        placeholder="Brief product description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingredients
                      </label>
                      <Input
                        value={product.ingredients}
                        onChange={(e) => updateProduct('ingredients', e.target.value)}
                        placeholder="Comma-separated ingredients"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={product.description}
                      onChange={(e) => updateProduct('description', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      placeholder="Detailed product description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <Input
                      value={product.features}
                      onChange={(e) => updateProduct('features', e.target.value)}
                      placeholder="Comma-separated features"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={product.isActive}
                        onChange={(e) => updateProduct('isActive', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={product.isFeatured}
                        onChange={(e) => updateProduct('isFeatured', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                        Featured
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images (comma-separated URLs)
                    </label>
                    <textarea
                      value={product.images}
                      onChange={(e) => updateProduct('images', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                  
                  {product.images && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Image Preview</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {product.images.split(',').filter(Boolean).map((image, index) => (
                          <div key={index} className="relative h-24 w-24">
                            <Image
                              src={image.trim()}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'variants' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Product Variants</h3>
                    <Button onClick={addVariant} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>

                  {/* Existing Variants */}
                  <div className="space-y-4">
                    {product.variants?.map((variant, index) => (
                      <Card key={variant.id || index}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Size *
                              </label>
                              <Input
                                value={variant.size}
                                onChange={(e) => updateVariant(variant.id!, 'size', e.target.value)}
                                placeholder="e.g., 1kg"
                                size="sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Flavor
                              </label>
                              <Input
                                value={variant.flavor || ''}
                                onChange={(e) => updateVariant(variant.id!, 'flavor', e.target.value)}
                                placeholder="e.g., Vanilla"
                                size="sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Price (₹) *
                              </label>
                              <Input
                                type="number"
                                value={variant.priceInINR}
                                onChange={(e) => updateVariant(variant.id!, 'priceInINR', Number(e.target.value))}
                                placeholder="0"
                                size="sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Original Price (₹)
                              </label>
                              <Input
                                type="number"
                                value={variant.originalPriceInINR || ''}
                                onChange={(e) => updateVariant(variant.id!, 'originalPriceInINR', e.target.value ? Number(e.target.value) : null)}
                                placeholder="0"
                                size="sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Stock
                              </label>
                              <Input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => updateVariant(variant.id!, 'stock', Number(e.target.value))}
                                placeholder="0"
                                size="sm"
                              />
                            </div>
                            <div className="flex items-end space-x-2">
                              <div className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  id={`active-${variant.id}`}
                                  checked={variant.isActive}
                                  onChange={(e) => updateVariant(variant.id!, 'isActive', e.target.checked)}
                                  className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                                />
                                <label htmlFor={`active-${variant.id}`} className="text-xs text-gray-700">
                                  Active
                                </label>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeVariant(variant.id!)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Add New Variant Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Variant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Size *
                          </label>
                          <Input
                            value={newVariant.size}
                            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                            placeholder="e.g., 1kg"
                            size="sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Flavor
                          </label>
                          <Input
                            value={newVariant.flavor || ''}
                            onChange={(e) => setNewVariant({ ...newVariant, flavor: e.target.value })}
                            placeholder="e.g., Vanilla"
                            size="sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Price (₹) *
                          </label>
                          <Input
                            type="number"
                            value={newVariant.priceInINR}
                            onChange={(e) => setNewVariant({ ...newVariant, priceInINR: Number(e.target.value) })}
                            placeholder="0"
                            size="sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Original Price (₹)
                          </label>
                          <Input
                            type="number"
                            value={newVariant.originalPriceInINR || ''}
                            onChange={(e) => setNewVariant({ ...newVariant, originalPriceInINR: e.target.value ? Number(e.target.value) : null })}
                            placeholder="0"
                            size="sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Stock
                          </label>
                          <Input
                            type="number"
                            value={newVariant.stock}
                            onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                            placeholder="0"
                            size="sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={addVariant} size="sm" className="w-full">
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nutrition Facts (JSON format)
                    </label>
                    <textarea
                      value={JSON.stringify(product.nutritionFacts, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value)
                          updateProduct('nutritionFacts', parsed)
                        } catch (error) {
                          // Invalid JSON, don't update
                        }
                      }}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green font-mono text-sm"
                      placeholder='{"servingSize": "1 scoop (30g)", "protein": "25g", "calories": "120"}'
                    />
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Instructions
                    </label>
                    <textarea
                      value={product.usageInstructions}
                      onChange={(e) => updateProduct('usageInstructions', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      placeholder="Step-by-step usage instructions..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Science Points
                    </label>
                    <textarea
                      value={product.sciencePoints}
                      onChange={(e) => updateProduct('sciencePoints', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      placeholder="Scientific backing and research points..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                    <Button onClick={addFAQ} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {product.faq?.map((faq, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question
                              </label>
                              <Input
                                value={faq.question}
                                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                placeholder="Enter question..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Answer
                              </label>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                                placeholder="Enter answer..."
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFAQ(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
