import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().min(1),
    priceInINR: z.number().min(0),
  })),
  subtotalInINR: z.number().min(0),
  shippingInINR: z.number().min(0),
  totalInINR: z.number().min(0),
  deliveryMethod: z.string(),
  addressId: z.string().optional(),
  newAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const orders = await db.order.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
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
    const { items, subtotalInINR, shippingInINR, totalInINR, deliveryMethod, addressId, newAddress } = createOrderSchema.parse(body)

    // Get or create address
    let shippingAddressId: string
    let billingAddressId: string

    if (addressId) {
      // Use existing address
      const address = await db.address.findFirst({
        where: {
          id: addressId,
          userId: session.user.id
        }
      })

      if (!address) {
        return NextResponse.json(
          { message: 'Address not found' },
          { status: 404 }
        )
      }

      shippingAddressId = address.id
      billingAddressId = address.id
    } else if (newAddress) {
      // Create new address
      const address = await db.address.create({
        data: {
          userId: session.user.id,
          type: 'SHIPPING',
          fullName: newAddress.fullName,
          phone: newAddress.phone,
          line1: newAddress.line1,
          line2: newAddress.line2 || null,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          isDefault: false
        }
      })

      shippingAddressId = address.id
      billingAddressId = address.id
    } else {
      return NextResponse.json(
        { message: 'Address is required' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderCount = await db.order.count()
    const orderNumber = `ORD-${String(orderCount + 1).padStart(3, '0')}`

    // Create order
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        number: orderNumber,
        status: 'PENDING',
        subtotalInINR: subtotalInINR,
        shippingInINR: shippingInINR,
        totalInINR: totalInINR,
        paymentStatus: 'PENDING',
        shippingAddressId,
        billingAddressId
      }
    })

    // Create order items
    const orderItems = await Promise.all(
      items.map(item =>
        db.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            qty: item.quantity,
            priceInINR: item.priceInINR
          }
        })
      )
    )

    // Clear cart items
    await db.cartItem.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    // Simulate payment processing (in real app, integrate with payment gateway)
    setTimeout(async () => {
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED'
        }
      })
    }, 2000)

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        totalInINR: order.totalInINR
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating order:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

