import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().min(1).max(10),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await db.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            images: true,
            slug: true
          }
        },
        variant: {
          select: {
            id: true,
            size: true,
            flavor: true,
            priceInINR: true,
            stock: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, variantId, quantity } = addToCartSchema.parse(body)

    // Check if variant exists and is active
    const variant = await db.variant.findFirst({
      where: {
        id: variantId,
        productId: productId,
        isActive: true,
        stock: {
          gte: quantity
        }
      }
    })

    if (!variant) {
      return NextResponse.json(
        { message: 'Product variant not available or out of stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: session.user.id,
          productId: productId,
          variantId: variantId
        }
      }
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          qty: existingItem.qty + quantity
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              images: true,
              slug: true
            }
          },
          variant: {
            select: {
              id: true,
              size: true,
              flavor: true,
              priceInINR: true,
              stock: true
            }
          }
        }
      })

      return NextResponse.json({ 
        message: 'Cart updated successfully',
        cartItem: updatedItem 
      })
    } else {
      // Create new cart item
      const newItem = await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          variantId: variantId,
          qty: quantity
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              images: true,
              slug: true
            }
          },
          variant: {
            select: {
              id: true,
              size: true,
              flavor: true,
              priceInINR: true,
              stock: true
            }
          }
        }
      })

      return NextResponse.json({ 
        message: 'Item added to cart successfully',
        cartItem: newItem 
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

