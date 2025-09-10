import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
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
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Start a transaction to update product and variants
    const result = await db.$transaction(async (tx) => {
      // Update the product
      const updatedProduct = await tx.product.update({
        where: { id },
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

      // Handle variants
      if (variants && Array.isArray(variants)) {
        // Delete existing variants that are not in the new list
        const existingVariants = await tx.variant.findMany({
          where: { productId: id }
        })

        const newVariantIds = variants
          .filter((v: any) => v.id && !v.id.startsWith('temp-'))
          .map((v: any) => v.id)

        const variantsToDelete = existingVariants.filter(
          v => !newVariantIds.includes(v.id)
        )

        for (const variant of variantsToDelete) {
          await tx.variant.delete({
            where: { id: variant.id }
          })
        }

        // Update or create variants
        for (const variant of variants) {
          const variantData = {
            size: variant.size,
            flavor: variant.flavor,
            priceInINR: variant.priceInINR,
            compareAtInINR: variant.originalPriceInINR,
            stock: variant.stock,
            isActive: variant.isActive,
            productId: id,
            sku: `${id}-${variant.size}-${variant.flavor || 'default'}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
          }

          if (variant.id && !variant.id.startsWith('temp-')) {
            // Update existing variant
            await tx.variant.update({
              where: { id: variant.id },
              data: variantData
            })
          } else {
            // Create new variant
            await tx.variant.create({
              data: variantData
            })
          }
        }
      }

      return updatedProduct
    })

    // Fetch the updated product with all relations
    const updatedProductWithRelations = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
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

    return NextResponse.json({ 
      message: 'Product updated successfully',
      product: updatedProductWithRelations 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if product has orders
    const orderCount = await db.orderItem.count({
      where: { productId: id }
    })

    if (orderCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete product with existing orders' },
        { status: 400 }
      )
    }

    // Delete product and related data
    await db.$transaction(async (tx) => {
      // Delete variants
      await tx.variant.deleteMany({
        where: { productId: id }
      })

      // Delete reviews
      await tx.review.deleteMany({
        where: { productId: id }
      })

      // Delete the product
      await tx.product.delete({
        where: { id }
      })
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
