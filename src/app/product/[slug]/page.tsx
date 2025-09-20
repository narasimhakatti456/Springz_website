import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/product/ProductDetail'
import { db } from '@/lib/db'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug: slug },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { priceInINR: 'asc' }
      }
    }
  })

  if (!product) {
    return {
      title: 'Product Not Found - Springz Nutrition'
    }
  }

  const defaultVariant = product.variants[0]
  const images = product.images.split(',').filter(Boolean)

  return {
    title: `${product.title} - Springz Nutrition`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: images.length > 0 ? [images[0]] : [],
      type: 'product',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug: slug },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { priceInINR: 'asc' }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading product...</div>}>
          <ProductDetail product={product} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

