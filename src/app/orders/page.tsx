'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Package, Eye, Truck } from 'lucide-react'
import Link from 'next/link'
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
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchOrders()
    } else {
      router.push('/auth/signin')
    }
  }, [session, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-springz-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-springz-green mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Order #{order.number}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <span className="text-lg font-semibold text-springz-green">
                        {formatPrice(order.totalInINR)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const images = item.product.images.split(',').filter(Boolean)
                        return (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
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

                    {/* Order Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'shipped' && (
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

