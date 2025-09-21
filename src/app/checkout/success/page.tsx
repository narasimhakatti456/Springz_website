'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, Package, Truck, Mail } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Order {
  id: string
  number: string
  status: string
  totalInINR: number
  createdAt: string
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
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      fetchOrder()
    }
  }, [orderNumber])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
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
            <Link href="/shop">
              <Button>Continue Shopping</Button>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-springz-green mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="success">{order.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-springz-green">
                    {formatPrice(order.totalInINR)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Address
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
          </div>

          {/* Order Items */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const images = item.product.images.split(',').filter(Boolean)
                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                          <img
                            src={images[0] || '/placeholder-product.jpg'}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
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
                        <div className="text-sm font-medium">
                          {formatPrice(item.priceInINR * item.qty)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-springz-light-green rounded-full flex items-center justify-center mb-3">
                  <Mail className="h-6 w-6 text-springz-green" />
                </div>
                <h3 className="font-medium mb-2">Confirmation Email</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an order confirmation email shortly with all the details.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-springz-light-green rounded-full flex items-center justify-center mb-3">
                  <Package className="h-6 w-6 text-springz-green" />
                </div>
                <h3 className="font-medium mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  We'll prepare your order and send you tracking information once it ships.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-springz-light-green rounded-full flex items-center justify-center mb-3">
                  <Truck className="h-6 w-6 text-springz-green" />
                </div>
                <h3 className="font-medium mb-2">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your order will be delivered within 3-5 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/orders">
            <Button variant="outline" size="lg">
              View All Orders
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-springz-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

