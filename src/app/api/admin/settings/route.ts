import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Default settings - in a real app, these would come from a database
    const defaultSettings = {
      general: {
        storeName: 'Springz Nutrition',
        storeDescription: 'Science-grade nutrition for everyday life. Clean, high-digestibility plant protein for real-world performance with DIAAS-100% formulation.',
        contactEmail: 'support@springz.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Nutrition St, Health City, HC 12345',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        maintenanceMode: false
      },
      shipping: {
        freeShippingThreshold: 500,
        standardShippingCost: 50,
        expressShippingCost: 100,
        deliveryTimeStandard: '3-5 business days',
        deliveryTimeExpress: '1-2 business days',
        codCharges: 30,
        internationalShipping: false
      },
      payment: {
        razorpayEnabled: true,
        upiEnabled: true,
        netBankingEnabled: true,
        codEnabled: true,
        autoCapture: true
      },
      notifications: {
        orderConfirmation: true,
        shipmentUpdates: true,
        lowStockAlerts: true,
        newOrderAlerts: true,
        marketingEmails: true
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: 'medium',
        ipWhitelist: []
      }
    }

    return NextResponse.json({ settings: defaultSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const settings = await request.json()

    // In a real application, you would save these settings to a database
    // For now, we'll just validate and return success
    
    // Basic validation
    if (!settings.general?.storeName || !settings.general?.contactEmail) {
      return NextResponse.json(
        { message: 'Store name and contact email are required' },
        { status: 400 }
      )
    }

    if (settings.shipping?.freeShippingThreshold < 0) {
      return NextResponse.json(
        { message: 'Free shipping threshold must be positive' },
        { status: 400 }
      )
    }

    // Here you would typically save to database
    // await db.settings.upsert({ ... })
    
    console.log('Settings updated:', settings)

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

