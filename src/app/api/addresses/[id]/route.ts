import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'PIN code is required'),
  isDefault: z.boolean().optional().default(false),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { fullName, phone, line1, line2, city, state, pincode, isDefault } = updateAddressSchema.parse(body)

    // Check if address belongs to user
    const existingAddress = await db.address.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      )
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await db.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: {
            not: id
          }
        },
        data: {
          isDefault: false
        }
      })
    }

    const updatedAddress = await db.address.update({
      where: {
        id: id
      },
      data: {
        fullName,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
        isDefault
      }
    })

    return NextResponse.json({
      message: 'Address updated successfully',
      address: updatedAddress
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating address:', error)
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
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if address belongs to user
    const existingAddress = await db.address.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      )
    }

    await db.address.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({
      message: 'Address deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

