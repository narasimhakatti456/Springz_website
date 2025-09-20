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
import { User, MapPin, Package, Settings, Plus, Edit, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'PIN code is required'),
  isDefault: z.boolean().optional().default(false),
})

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

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
  })

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
    reset: resetAddressForm,
    setValue: setAddressValue,
  } = useForm({
    resolver: zodResolver(addressSchema),
  })

  useEffect(() => {
    if (session) {
      setProfileValue('name', session.user.name)
      setProfileValue('email', session.user.email)
      fetchAddresses()
    } else {
      router.push('/auth/signin')
    }
  }, [session, router, setProfileValue])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const onProfileSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Something went wrong')
    }
  }

  const onAddressSubmit = async (data: any) => {
    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses'
      const method = editingAddress ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully')
        setShowAddressForm(false)
        setEditingAddress(null)
        resetAddressForm()
        fetchAddresses()
      } else {
        toast.error('Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Something went wrong')
    }
  }

  const editAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressValue('fullName', address.fullName)
    setAddressValue('phone', address.phone)
    setAddressValue('line1', address.line1)
    setAddressValue('line2', address.line2 || '')
    setAddressValue('city', address.city)
    setAddressValue('state', address.state)
    setAddressValue('pincode', address.pincode)
    setAddressValue('isDefault', address.isDefault)
    setShowAddressForm(true)
  }

  const deleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Address deleted successfully')
        fetchAddresses()
      } else {
        toast.error('Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Something went wrong')
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-springz-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-springz-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
          <h1 className="text-3xl font-bold text-springz-green mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-springz-light-green text-springz-green border-r-2 border-springz-green'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          {...registerProfile('name')}
                          placeholder="Enter your full name"
                        />
                        {profileErrors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileErrors.name.message as string}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          {...registerProfile('email')}
                          type="email"
                          placeholder="Enter your email"
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                    <Button type="submit">Update Profile</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-springz-green">Addresses</h2>
                  <Button
                    onClick={() => {
                      setEditingAddress(null)
                      resetAddressForm()
                      setShowAddressForm(true)
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <Input
                              {...registerAddress('fullName')}
                              placeholder="Enter full name"
                            />
                            {addressErrors.fullName && (
                              <p className="mt-1 text-sm text-red-600">
                                {addressErrors.fullName.message as string}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <Input
                              {...registerAddress('phone')}
                              placeholder="Enter phone number"
                            />
                            {addressErrors.phone && (
                              <p className="mt-1 text-sm text-red-600">
                                {addressErrors.phone.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                          </label>
                          <Input
                            {...registerAddress('line1')}
                            placeholder="Street address, building, house no."
                          />
                          {addressErrors.line1 && (
                            <p className="mt-1 text-sm text-red-600">
                              {addressErrors.line1.message as string}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2
                          </label>
                          <Input
                            {...registerAddress('line2')}
                            placeholder="Apartment, suite, unit, etc. (optional)"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <Input
                              {...registerAddress('city')}
                              placeholder="Enter city"
                            />
                            {addressErrors.city && (
                              <p className="mt-1 text-sm text-red-600">
                                {addressErrors.city.message as string}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <Input
                              {...registerAddress('state')}
                              placeholder="Enter state"
                            />
                            {addressErrors.state && (
                              <p className="mt-1 text-sm text-red-600">
                                {addressErrors.state.message as string}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              PIN Code *
                            </label>
                            <Input
                              {...registerAddress('pincode')}
                              placeholder="Enter PIN code"
                            />
                            {addressErrors.pincode && (
                              <p className="mt-1 text-sm text-red-600">
                                {addressErrors.pincode.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            {...registerAddress('isDefault')}
                            type="checkbox"
                            id="isDefault"
                            className="rounded border-gray-300 text-springz-green focus:ring-springz-green"
                          />
                          <label htmlFor="isDefault" className="text-sm text-gray-700">
                            Set as default address
                          </label>
                        </div>
                        <div className="flex space-x-3">
                          <Button type="submit">
                            {editingAddress ? 'Update Address' : 'Add Address'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddressForm(false)
                              setEditingAddress(null)
                              resetAddressForm()
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Address List */}
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{address.fullName}</h3>
                              {address.isDefault && (
                                <Badge variant="success">Default</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>
                                {address.line1}
                                {address.line2 && `, ${address.line2}`}
                              </div>
                              <div>
                                {address.city}, {address.state} - {address.pincode}
                              </div>
                              <div>{address.phone}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editAddress(address)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-springz-green mb-4">Recent Orders</h2>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">View All Orders</h3>
                    <p className="text-gray-500 mb-4">See your complete order history and track your packages.</p>
                    <Button onClick={() => router.push('/orders')}>
                      View Orders
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Update your password to keep your account secure.
                      </p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Notification Preferences</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Manage how you receive notifications about your orders and account.
                      </p>
                      <Button variant="outline">Manage Notifications</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

