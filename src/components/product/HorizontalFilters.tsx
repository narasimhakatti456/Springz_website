'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronDown, X, Filter } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  placeholder: string
}

export default function HorizontalFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    flavor: searchParams.get('flavor') || '',
    size: searchParams.get('size') || '',
    sortBy: searchParams.get('sortBy') || 'name',
  })
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filterConfigs: FilterConfig[] = [
    {
      key: 'category',
      label: 'Category',
      placeholder: 'All Categories',
      options: [
        { value: 'premium-plant-proteins', label: 'Premium Plant Proteins' },
        { value: 'functional-foods', label: 'Functional Foods' },
        { value: 'guilt-free-snacks', label: 'Guilt-Free Snacks' },
        { value: 'wellness-supplements', label: 'Wellness Supplements' },
        { value: 'sports-nutrition', label: 'Sports Nutrition' },
      ]
    },
    {
      key: 'priceRange',
      label: 'Price Range',
      placeholder: 'Any Price',
      options: [
        { value: '0-500', label: 'Under ₹500' },
        { value: '500-1000', label: '₹500 - ₹1,000' },
        { value: '1000-1500', label: '₹1,000 - ₹1,500' },
        { value: '1500-2000', label: '₹1,500 - ₹2,000' },
        { value: '2000+', label: 'Above ₹2,000' },
      ]
    },
    {
      key: 'flavor',
      label: 'Flavor',
      placeholder: 'All Flavors',
      options: [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'vanilla', label: 'Vanilla' },
        { value: 'unflavored', label: 'Unflavored' },
        { value: 'sweetened', label: 'Sweetened' },
        { value: 'spicy', label: 'Hot & Spicy' },
        { value: 'mint', label: 'Mint' },
        { value: 'strawberry', label: 'Strawberry' },
      ]
    },
    {
      key: 'size',
      label: 'Size',
      placeholder: 'All Sizes',
      options: [
        { value: '100g', label: '100g' },
        { value: '200g', label: '200g' },
        { value: '500g', label: '500g' },
        { value: '900g', label: '900g' },
        { value: '1kg', label: '1kg' },
        { value: '2kg', label: '2kg' },
      ]
    },
    {
      key: 'sortBy',
      label: 'Sort By',
      placeholder: 'Sort By',
      options: [
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'name-desc', label: 'Name (Z-A)' },
        { value: 'price', label: 'Price (Low to High)' },
        { value: 'price-desc', label: 'Price (High to Low)' },
        { value: 'rating', label: 'Rating (High to Low)' },
        { value: 'newest', label: 'Newest First' },
        { value: 'popular', label: 'Most Popular' },
      ]
    }
  ]

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setOpenDropdown(null)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && k !== 'sortBy') params.set(k, v)
    })
    
    // Add sortBy to URL if it's not the default
    if (newFilters.sortBy && newFilters.sortBy !== 'name') {
      params.set('sortBy', newFilters.sortBy)
    }
    
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...filters, [key]: '' }
    setFilters(newFilters)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && k !== 'sortBy') params.set(k, v)
    })
    
    if (newFilters.sortBy && newFilters.sortBy !== 'name') {
      params.set('sortBy', newFilters.sortBy)
    }
    
    router.push(`/shop?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setFilters({ category: '', priceRange: '', flavor: '', size: '', sortBy: 'name' })
    router.push('/shop')
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value && (key === 'sortBy' ? value !== 'name' : true)
  ).length

  const getFilterLabel = (config: FilterConfig) => {
    const selectedOption = config.options.find(option => option.value === filters[config.key as keyof typeof filters])
    return selectedOption ? selectedOption.label : config.placeholder
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-springz-green" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="outline" className="bg-springz-light-green text-springz-green">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Horizontal Filter Dropdowns */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {filterConfigs.map((config) => (
          <div key={config.key} className="relative">
            <Button
              variant="outline"
              onClick={() => setOpenDropdown(openDropdown === config.key ? null : config.key)}
              className="flex items-center space-x-1 sm:space-x-2 min-w-[120px] sm:min-w-[140px] justify-between text-xs sm:text-sm"
            >
              <span className="truncate">{getFilterLabel(config)}</span>
              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${
                openDropdown === config.key ? 'rotate-180' : ''
              }`} />
            </Button>

            {/* Dropdown Menu */}
            {openDropdown === config.key && (
              <div className="absolute top-full left-0 mt-1 w-64 sm:w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{config.label}</h4>
                    {filters[config.key as keyof typeof filters] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearFilter(config.key)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {config.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFilter(config.key, option.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          filters[config.key as keyof typeof filters] === option.value
                            ? 'bg-springz-light-green text-springz-green font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filterConfigs.map((config) => {
              const value = filters[config.key as keyof typeof filters]
              if (!value || (config.key === 'sortBy' && value === 'name')) return null
              
              const option = config.options.find(opt => opt.value === value)
              return (
                <Badge
                  key={config.key}
                  variant="outline"
                  className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  onClick={() => clearFilter(config.key)}
                >
                  {config.label}: {option?.label}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
