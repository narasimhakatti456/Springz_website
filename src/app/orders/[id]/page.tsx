'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Package, MapPin, CreditCard, Truck, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderDetail {
  id: string
  number: string
  status: string
  paymentStatus: string
  totalInINR: number
  subtotalInINR: number
  shippingInINR: number
  trackingNumber: string | null
  createdAt: string
  updatedAt: string
  items: {
    id: string
    qty: number
    priceInINR: number
    product: {
      title: string
      images: string
      slug: string
    }
    variant: {
      size: string
      flavor: string | null
    }
  }[]
  shippingAddress: {
    fullName: string
    phone: string
    line1: string
    line2: string | null
    city: string
    state: string
    pincode: string
  }
  billingAddress: {
    fullName: string
    phone: string
    line1: string
    line2: string | null
    city: string
    state: string
    pincode: string
  }
}

interface OrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string>('')

  useEffect(() => {
    const getOrderId = async () => {
      const { id } = await params
      setOrderId(id)
    }
    getOrderId()
  }, [params])

  useEffect(() => {
    if (session && orderId) {
      fetchOrder()
    } else if (session === null) {
      router.push('/auth/signin')
    }
  }, [session, router, orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else if (response.status === 404) {
        router.push('/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning'
      case 'confirmed':
        return 'default'
      case 'processing':
        return 'default'
      case 'shipped':
        return 'default'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning'
      case 'paid':
        return 'success'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getOrderTimeline = (status: string) => {
    const timeline = [
      { status: 'pending', label: 'Order Placed', completed: true },
      { status: 'confirmed', label: 'Order Confirmed', completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(status) },
      { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
      { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { status: 'delivered', label: 'Delivered', completed: status === 'delivered' },
    ]
    return timeline
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-springz-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-springz-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-springz-green mb-2">
                Order #{order.number}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Badge variant={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getOrderTimeline(order.status).map((step, index) => (
                    <div key={step.status} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step.completed
                          ? 'bg-springz-green border-springz-green text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className={`font-medium ${
                          step.completed ? 'text-springz-green' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </div>
                        {step.status === 'shipped' && order.trackingNumber && (
                          <div className="text-sm text-gray-600">
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const images = item.product.images.split(',').filter(Boolean)
                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <Link href={`/product/${item.product.slug}`}>
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                            <Image
                              src={images[0] || '/placeholder-product.jpg'}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${item.product.slug}`}>
                            <h3 className="font-medium text-springz-green hover:text-springz-orange transition-colors">
                              {item.product.title}
                            </h3>
                          </Link>
                          <div className="text-sm text-gray-600">
                            {item.variant.size}
                            {item.variant.flavor && ` • ${item.variant.flavor}`}
                          </div>
                          <div className="text-sm text-gray-600">Qty: {item.qty}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(item.priceInINR * item.qty)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(item.priceInINR)} each
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotalInINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.shippingInINR === 0 ? (
                      <Badge variant="success">Free</Badge>
                    ) : (
                      formatPrice(order.shippingInINR)
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.totalInINR)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="font-medium">{order.shippingAddress.fullName}</div>
                  <div className="text-gray-600">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                  </div>
                  <div className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </div>
                  <div className="text-gray-600">{order.shippingAddress.phone}</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="outline" className="w-full">
                    Reorder Items
                  </Button>
                )}
                {order.status === 'shipped' && order.trackingNumber && (
                  <Button variant="outline" className="w-full">
                    Track Package
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

