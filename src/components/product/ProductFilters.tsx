'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function ProductFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    flavor: searchParams.get('flavor') || '',
    size: searchParams.get('size') || '',
  })

  const categories = [
    { value: 'premium-plant-proteins', label: 'Premium Plant Proteins' },
    { value: 'functional-foods', label: 'Functional Foods' },
    { value: 'guilt-free-snacks', label: 'Guilt-Free Snacks' },
  ]

  const priceRanges = [
    { value: '0-500', label: 'Under ₹500' },
    { value: '500-1000', label: '₹500 - ₹1,000' },
    { value: '1000-1500', label: '₹1,000 - ₹1,500' },
    { value: '1500+', label: 'Above ₹1,500' },
  ]

  const flavors = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'unflavored', label: 'Unflavored' },
    { value: 'sweetened', label: 'Sweetened' },
    { value: 'spicy', label: 'Hot & Spicy' },
  ]

  const sizes = [
    { value: '100g', label: '100g' },
    { value: '200g', label: '200g' },
    { value: '500g', label: '500g' },
    { value: '900g', label: '900g' },
  ]

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ category: '', priceRange: '', flavor: '', size: '' })
    router.push('/shop')
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-springz-green">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => updateFilter('category', category.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.category === category.value
                  ? 'bg-springz-light-green text-springz-green'
                  : 'hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => updateFilter('priceRange', range.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.priceRange === range.value
                  ? 'bg-springz-light-green text-springz-green'
                  : 'hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Flavor Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flavor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {flavors.map((flavor) => (
            <button
              key={flavor.value}
              onClick={() => updateFilter('flavor', flavor.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.flavor === flavor.value
                  ? 'bg-springz-light-green text-springz-green'
                  : 'hover:bg-gray-100'
              }`}
            >
              {flavor.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Size Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sizes.map((size) => (
            <button
              key={size.value}
              onClick={() => updateFilter('size', size.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                filters.size === size.value
                  ? 'bg-springz-light-green text-springz-green'
                  : 'hover:bg-gray-100'
              }`}
            >
              {size.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => updateFilter('category', '')}>
                  Category: {categories.find(c => c.value === filters.category)?.label} ×
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => updateFilter('priceRange', '')}>
                  Price: {priceRanges.find(p => p.value === filters.priceRange)?.label} ×
                </Badge>
              )}
              {filters.flavor && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => updateFilter('flavor', '')}>
                  Flavor: {flavors.find(f => f.value === filters.flavor)?.label} ×
                </Badge>
              )}
              {filters.size && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => updateFilter('size', '')}>
                  Size: {sizes.find(s => s.value === filters.size)?.label} ×
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

