import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        },
        variants: {
          select: {
            id: true,
            size: true,
            flavor: true,
            priceInINR: true,
            stock: true,
            isActive: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      title,
      description,
      shortDescription,
      images,
      features,
      ingredients,
      categoryId,
      isActive,
      isFeatured,
      variants,
      nutritionFacts,
      usageInstructions,
      sciencePoints,
      faq
    } = data

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { message: 'Title, description, and category are required' },
        { status: 400 }
      )
    }

    if (!variants || variants.length === 0) {
      return NextResponse.json(
        { message: 'At least one product variant is required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Start a transaction to create product and variants
    const result = await db.$transaction(async (tx) => {
      // Create the product
      const product = await tx.product.create({
        data: {
          title,
          slug,
          description,
          images,
          features,
          categoryId,
          nutritionJson: nutritionFacts ? JSON.stringify(nutritionFacts) : null
        }
      })

      // Create variants
      for (const variant of variants) {
        await tx.variant.create({
          data: {
            size: variant.size,
            flavor: variant.flavor,
            priceInINR: variant.priceInINR,
            compareAtInINR: variant.originalPriceInINR,
            stock: variant.stock,
            isActive: variant.isActive,
            productId: product.id,
            sku: `${product.id}-${variant.size}-${variant.flavor || 'default'}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
          }
        })
      }

      return product
    })

    // Fetch the created product with all relations
    const createdProduct = await db.product.findUnique({
      where: { id: result.id },
      include: {
        category: true,
        variants: {
          orderBy: { priceInINR: 'asc' }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Product created successfully',
      product: createdProduct 
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
