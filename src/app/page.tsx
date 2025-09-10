import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import ProductCategories from '@/components/home/ProductCategories'
import TrustIndicators from '@/components/home/TrustIndicators'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Hero />
          <TrustIndicators />
          <ProductCategories />
          <FeaturedProducts />
          <Testimonials />
          <Newsletter />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
