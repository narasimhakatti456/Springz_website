'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  slug: string
  title: string
  description: string
  images: string
  features: string
  variants: {
    id: string
    sku: string
    size: string
    flavor: string | null
    priceInINR: number
    compareAtInINR: number | null
    stock: number
    isActive: boolean
  }[]
  category: {
    name: string
    slug: string
  }
  reviews: {
    rating: number
  }[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const defaultVariant = product.variants.find(v => v.isActive) || product.variants[0]
  const images = product.images.split(',').filter(Boolean)
  const features = product.features.split(',').filter(Boolean)
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0

  const handleAddToCart = async () => {
    if (!defaultVariant) return
    
    setIsAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: defaultVariant.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        // Show success message or update cart count
        console.log('Added to cart successfully')
      } else {
        console.error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist functionality
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <div className="relative h-64 overflow-hidden">
            <Image
              src={images[0] || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {defaultVariant?.compareAtInINR && defaultVariant.compareAtInINR > defaultVariant.priceInINR && (
              <Badge variant="error" className="absolute top-2 left-2">
                Sale
              </Badge>
            )}
          </div>
        </Link>
        
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart 
            className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category.name}
          </Badge>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-springz-green mb-2 group-hover:text-springz-orange transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.reviews.length})
            </span>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-springz-light-green text-springz-green px-2 py-1 rounded-full"
            >
              {feature.trim()}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-springz-green">
              {formatPrice(defaultVariant?.priceInINR || 0)}
            </span>
            {defaultVariant?.compareAtInINR && defaultVariant.compareAtInINR > defaultVariant.priceInINR && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(defaultVariant.compareAtInINR)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {defaultVariant?.size}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !defaultVariant?.stock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  )
}

