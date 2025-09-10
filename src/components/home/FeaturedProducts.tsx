import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Star, ShoppingCart } from 'lucide-react'

const featuredProducts = [
  {
    id: '1',
    title: 'Premium Plant Protein',
    slug: 'premium-plant-protein',
    price: 2999,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    badge: 'Best Seller',
    description: 'DIAAS-100% formulation with 26g protein per serving'
  },
  {
    id: '2',
    title: 'Recovery Blend',
    slug: 'recovery-blend',
    price: 2499,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    badge: 'New',
    description: 'Perfect post-workout recovery with natural ingredients'
  },
  {
    id: '3',
    title: 'Energy Boost',
    slug: 'energy-boost',
    price: 1999,
    originalPrice: 2299,
    rating: 4.7,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    badge: 'Limited',
    description: 'Natural energy without the crash, 0g sugar'
  }
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highest-rated nutrition products, 
            carefully crafted for optimal health and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={product.badge === 'Best Seller' ? 'default' : 'secondary'}
                      className="bg-springz-orange text-white"
                    >
                      {product.badge}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-springz-green mb-2 group-hover:text-springz-orange transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-springz-green">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/product/${product.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button className="flex-shrink-0">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop">
            <Button size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

