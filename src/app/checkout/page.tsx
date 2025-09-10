'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, MapPin, CreditCard, Truck } from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  qty: number
  product: {
    id: string
    title: string
    images: string
    slug: string
  }
  variant: {
    id: string
    size: string
    flavor: string | null
    priceInINR: number
    stock: number
  }
}

interface Address {
  id: string
  fullName: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form states
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [useExistingAddress, setUseExistingAddress] = useState(true)
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [deliveryMethod, setDeliveryMethod] = useState('standard')

  useEffect(() => {
    if (session) {
      fetchData()
    } else {
      router.push('/auth/signin')
    }
  }, [session, router])

  const fetchData = async () => {
    try {
      const [cartResponse, addressesResponse] = await Promise.all([
        fetch('/api/cart'),
        fetch('/api/addresses')
      ])

      if (cartResponse.ok) {
        const cartData = await cartResponse.json()
        setCartItems(cartData.cartItems || [])
      }

      if (addressesResponse.ok) {
        const addressesData = await addressesResponse.json()
        setAddresses(addressesData.addresses || [])
        const defaultAddress = addressesData.addresses?.find((addr: Address) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.variant.priceInINR * item.qty)
  }, 0)

  const shipping = subtotal >= 50000 ? 0 : 3000
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    if (!selectedAddress && useExistingAddress) {
      toast.error('Please select a delivery address')
      return
    }

    if (!useExistingAddress && (!newAddress.fullName || !newAddress.phone || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode)) {
      toast.error('Please fill in all required address fields')
      return
    }

    setProcessing(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          variantId: item.variant.id,
          quantity: item.qty,
          priceInINR: item.variant.priceInINR
        })),
        subtotalInINR: subtotal,
        shippingInINR: shipping,
        totalInINR: total,
        deliveryMethod,
        ...(useExistingAddress 
          ? { addressId: selectedAddress }
          : { newAddress }
        )
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        router.push(`/checkout/success?order=${order.order.number}`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Something went wrong')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-springz-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some items to your cart before checking out.</p>
            <Button onClick={() => router.push('/shop')}>
              Continue Shopping
            </Button>
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
          <h1 className="text-3xl font-bold text-springz-green mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Information', icon: MapPin },
              { step: 2, title: 'Address', icon: MapPin },
              { step: 3, title: 'Delivery', icon: Truck },
              { step: 4, title: 'Payment', icon: CreditCard },
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-springz-green border-springz-green text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-springz-green' : 'text-gray-400'
                }`}>
                  {title}
                </span>
                {step < 4 && (
                  <div className={`w-8 h-0.5 ml-4 ${
                    currentStep > step ? 'bg-springz-green' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={session?.user?.name || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setUseExistingAddress(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      useExistingAddress
                        ? 'bg-springz-green text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Use Existing Address
                  </button>
                  <button
                    onClick={() => setUseExistingAddress(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !useExistingAddress
                        ? 'bg-springz-green text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Add New Address
                  </button>
                </div>

                {useExistingAddress ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedAddress === address.id
                            ? 'border-springz-green bg-springz-light-green'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{address.fullName}</div>
                            <div className="text-sm text-gray-600">
                              {address.line1}
                              {address.line2 && `, ${address.line2}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pincode}
                            </div>
                            <div className="text-sm text-gray-600">{address.phone}</div>
                          </div>
                          {selectedAddress === address.id && (
                            <CheckCircle className="h-5 w-5 text-springz-green" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <Input
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <Input
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        placeholder="Street address, building, house no."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <Input
                        value={newAddress.line2}
                        onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <Input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <Input
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="Enter PIN code"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      deliveryMethod === 'standard'
                        ? 'border-springz-green bg-springz-light-green'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setDeliveryMethod('standard')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Standard Delivery</div>
                        <div className="text-sm text-gray-600">3-5 business days</div>
                      </div>
                      <div className="text-sm font-medium">
                        {shipping === 0 ? 'Free' : formatPrice(3000)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      deliveryMethod === 'express'
                        ? 'border-springz-green bg-springz-light-green'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setDeliveryMethod('express')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Express Delivery</div>
                        <div className="text-sm text-gray-600">1-2 business days</div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(5000)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const images = item.product.images.split(',').filter(Boolean)
                    return (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={images[0] || '/placeholder-product.jpg'}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.product.title}</div>
                          <div className="text-xs text-gray-600">
                            {item.variant.size}
                            {item.variant.flavor && ` • ${item.variant.flavor}`}
                          </div>
                          <div className="text-xs text-gray-600">Qty: {item.qty}</div>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(item.variant.priceInINR * item.qty)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {deliveryMethod === 'standard' && shipping === 0 ? (
                        <Badge variant="success">Free</Badge>
                      ) : deliveryMethod === 'express' ? (
                        formatPrice(5000)
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        {formatPrice(total + (deliveryMethod === 'express' ? 2000 : 0))}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </Button>

                {/* Trust Indicators */}
                <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>30-day returns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>FSSAI/GMP certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

