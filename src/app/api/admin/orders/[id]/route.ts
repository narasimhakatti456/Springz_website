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
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        shippingAddress: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            },
            variant: {
              select: {
                size: true,
                flavor: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
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
    const { status } = await request.json()

    if (!status || !['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    const order = await db.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        shippingAddress: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            },
            variant: {
              select: {
                size: true,
                flavor: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
