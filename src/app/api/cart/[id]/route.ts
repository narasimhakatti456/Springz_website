import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateCartSchema = z.object({
  quantity: z.number().min(0).max(10),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { quantity } = updateCartSchema.parse(body)

    // Check if cart item belongs to user
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item from cart
      await db.cartItem.delete({
        where: {
          id: params.id
        }
      })

      return NextResponse.json({ 
        message: 'Item removed from cart successfully' 
      })
    } else {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: {
          id: params.id
        },
        data: {
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
        message: 'Cart updated successfully',
        cartItem: updatedItem 
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating cart:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if cart item belongs to user
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      )
    }

    await db.cartItem.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ 
      message: 'Item removed from cart successfully' 
    })
  } catch (error) {
    console.error('Error deleting cart item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

