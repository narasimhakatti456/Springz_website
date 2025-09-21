'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Heart, ShoppingCart, Star, Check, Truck, Shield, RotateCcw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductDetailProps {
  product: {
    id: string
    slug: string
    title: string
    description: string
    images: string
    features: string
    nutritionJson: string | null
    category: {
      name: string
      slug: string
    }
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
    reviews: {
      id: string
      rating: number
      title: string | null
      content: string | null
      createdAt: Date
      user: {
        name: string
      }
    }[]
  }
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const images = product.images.split(',').filter(Boolean)
  const features = product.features.split(',').filter(Boolean)
  const nutrition = product.nutritionJson ? JSON.parse(product.nutritionJson) : null
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant.id,
          quantity: quantity,
        }),
      })

      if (response.ok) {
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

  const handleBuyNow = async () => {
    await handleAddToCart()
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-lg">
          <Image
            src={images[selectedImageIndex] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative h-20 overflow-hidden rounded-md border-2 ${
                  selectedImageIndex === index ? 'border-springz-green' : 'border-gray-200'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm">
          <Link href="/" className="text-springz-orange hover:text-springz-green">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="text-springz-orange hover:text-springz-green">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <Link 
            href={`/shop?category=${product.category.slug}`}
            className="text-springz-orange hover:text-springz-green"
          >
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{product.title}</span>
        </nav>

        {/* Product Title and Category */}
        <div>
          <Badge variant="outline" className="mb-2">
            {product.category.name}
          </Badge>
          <h1 className="text-3xl font-bold text-springz-green mb-2">
            {product.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({product.reviews.length} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-springz-green">
            {formatPrice(selectedVariant.priceInINR)}
          </span>
          {selectedVariant.compareAtInINR && selectedVariant.compareAtInINR > selectedVariant.priceInINR && (
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(selectedVariant.compareAtInINR)}
            </span>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-springz-green">Size & Flavor</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedVariant.id === variant.id
                      ? 'border-springz-green bg-springz-light-green'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{variant.size}</div>
                  {variant.flavor && (
                    <div className="text-sm text-gray-600">{variant.flavor}</div>
                  )}
                  <div className="text-sm font-semibold text-springz-green">
                    {formatPrice(variant.priceInINR)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-springz-green">Quantity</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {selectedVariant.stock} in stock
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedVariant.stock}
            className="flex-1"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={isAddingToCart || !selectedVariant.stock}
            variant="secondary"
            size="lg"
          >
            Buy Now
          </Button>
          <Button
            onClick={() => setIsWishlisted(!isWishlisted)}
            variant="outline"
            size="lg"
          >
            <Heart 
              className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
          <div className="text-center">
            <Truck className="h-6 w-6 mx-auto text-springz-green mb-2" />
            <div className="text-sm font-medium">Free Shipping</div>
            <div className="text-xs text-gray-600">Over ₹500</div>
          </div>
          <div className="text-center">
            <Shield className="h-6 w-6 mx-auto text-springz-green mb-2" />
            <div className="text-sm font-medium">Secure Payment</div>
            <div className="text-xs text-gray-600">SSL Encrypted</div>
          </div>
          <div className="text-center">
            <RotateCcw className="h-6 w-6 mx-auto text-springz-green mb-2" />
            <div className="text-sm font-medium">30-Day Returns</div>
            <div className="text-xs text-gray-600">No Questions Asked</div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="lg:col-span-2 space-y-8">
        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature.trim()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Facts */}
        {nutrition && (
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(nutrition).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-springz-light-green rounded-lg">
                    <div className="text-2xl font-bold text-springz-green">{String(value)}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.user.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-1">{review.title}</h4>
                    )}
                    {review.content && (
                      <p className="text-gray-600">{review.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

