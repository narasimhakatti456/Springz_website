import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const order = await db.order.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true,
                slug: true
              }
            },
            variant: {
              select: {
                size: true,
                flavor: true
              }
            }
          }
        },
        shippingAddress: true,
        billingAddress: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
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

