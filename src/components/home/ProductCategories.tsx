import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'

export default function ProductCategories() {
  const categories = [
    {
      title: 'Protein Powders',
      description: 'High-quality plant proteins for optimal nutrition',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      href: '/shop?category=premium-plant-proteins',
      features: ['DIAAS-100%', 'No Added Sugar', 'Easy to Digest']
    },
    {
      title: 'Functional Foods',
      description: 'Nutrient-dense foods for everyday wellness',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop',
      href: '/shop?category=functional-foods',
      features: ['High Protein', 'Natural', 'Versatile']
    },
    {
      title: 'High-Protein Snacks',
      description: 'Healthy snacks for any time of day',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      href: '/shop?category=guilt-free-snacks',
      features: ['Crunchy', 'Traditional Taste', 'No Added Sugar']
    }
  ]

  return (
    <section className="py-16 bg-springz-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-springz-green mb-4">
            Our Product Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of science-backed nutrition products designed for real-world performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={index} href={category.href}>
              <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-springz-green mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="inline-block bg-springz-light-green text-springz-green text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

