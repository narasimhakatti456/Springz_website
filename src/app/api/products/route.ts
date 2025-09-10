import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const priceRange = searchParams.get('priceRange')
    const flavor = searchParams.get('flavor')
    const size = searchParams.get('size')
    const sortBy = searchParams.get('sortBy') || 'name'

    // Build where clause
    const where: any = {
      variants: {
        some: {
          isActive: true,
          stock: {
            gt: 0
          }
        }
      }
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (flavor) {
      where.variants = {
        some: {
          isActive: true,
          stock: {
            gt: 0
          },
          flavor: {
            contains: flavor,
            mode: 'insensitive'
          }
        }
      }
    }

    if (size) {
      where.variants = {
        some: {
          isActive: true,
          stock: {
            gt: 0
          },
          size: size
        }
      }
    }

    // Build orderBy clause
    let orderBy: any = { title: 'asc' }
    
    switch (sortBy) {
      case 'name-desc':
        orderBy = { title: 'desc' }
        break
      case 'price':
        orderBy = { variants: { _min: { priceInINR: 'asc' } } }
        break
      case 'price-desc':
        orderBy = { variants: { _min: { priceInINR: 'desc' } } }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'rating':
        orderBy = { reviews: { _avg: { rating: 'desc' } } }
        break
      case 'popular':
        orderBy = { reviews: { _count: 'desc' } }
        break
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        variants: {
          where: {
            isActive: true,
            stock: {
              gt: 0
            }
          },
          orderBy: {
            priceInINR: 'asc'
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy
    })

    // Filter by price range if specified
    let filteredProducts = products
    if (priceRange) {
      filteredProducts = products.filter(product => {
        const minPrice = product.variants.reduce((min, variant) => 
          Math.min(min, variant.priceInINR), Infinity
        )
        
        switch (priceRange) {
          case '0-500':
            return minPrice <= 50000 // ₹500 in paise
          case '500-1000':
            return minPrice > 50000 && minPrice <= 100000
          case '1000-1500':
            return minPrice > 100000 && minPrice <= 150000
          case '1500+':
            return minPrice > 150000
          default:
            return true
        }
      })
    }

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
