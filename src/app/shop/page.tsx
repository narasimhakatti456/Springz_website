import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/product/ProductGrid'
import HorizontalFilters from '@/components/product/HorizontalFilters'

export const metadata = {
  title: 'Shop - Springz Nutrition',
  description: 'Browse our collection of premium plant proteins, functional foods, and high-protein snacks.',
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-springz-green mb-2">Shop</h1>
          <p className="text-gray-600">Discover our range of science-backed nutrition products</p>
        </div>

        {/* Horizontal Filters */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <HorizontalFilters />
        </Suspense>

        {/* Products Grid */}
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
