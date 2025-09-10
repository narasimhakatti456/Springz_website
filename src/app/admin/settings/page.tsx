'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Settings, 
  Store, 
  Truck, 
  CreditCard, 
  Bell, 
  Shield, 
  Globe,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SettingsData {
  general: {
    storeName: string
    storeDescription: string
    contactEmail: string
    contactPhone: string
    address: string
    timezone: string
    currency: string
    maintenanceMode: boolean
  }
  shipping: {
    freeShippingThreshold: number
    standardShippingCost: number
    expressShippingCost: number
    deliveryTimeStandard: string
    deliveryTimeExpress: string
    codCharges: number
    internationalShipping: boolean
  }
  payment: {
    razorpayEnabled: boolean
    upiEnabled: boolean
    netBankingEnabled: boolean
    codEnabled: boolean
    autoCapture: boolean
  }
  notifications: {
    orderConfirmation: boolean
    shipmentUpdates: boolean
    lowStockAlerts: boolean
    newOrderAlerts: boolean
    marketingEmails: boolean
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordPolicy: string
    ipWhitelist: string[]
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    })
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store configuration</p>
        </div>
        <div className="flex items-center space-x-4">
          {message && (
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-springz-light-green text-springz-green border-r-2 border-springz-green'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                {tabs.find(tab => tab.id === activeTab)?.label} Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Name *
                      </label>
                      <Input
                        value={settings.general.storeName}
                        onChange={(e) => updateSettings('general', 'storeName', e.target.value)}
                        placeholder="Springz Nutrition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <Input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => updateSettings('general', 'contactEmail', e.target.value)}
                        placeholder="support@springz.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <Input
                        value={settings.general.contactPhone}
                        onChange={(e) => updateSettings('general', 'contactPhone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      >
                        <option value="UTC">UTC</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => updateSettings('general', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => updateSettings('general', 'maintenanceMode', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                        Maintenance Mode
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Description
                    </label>
                    <textarea
                      value={settings.general.storeDescription}
                      onChange={(e) => updateSettings('general', 'storeDescription', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      placeholder="Describe your store..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      value={settings.general.address}
                      onChange={(e) => updateSettings('general', 'address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      placeholder="Enter your business address..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Shipping Threshold (₹)
                      </label>
                      <Input
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => updateSettings('shipping', 'freeShippingThreshold', Number(e.target.value))}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Standard Shipping Cost (₹)
                      </label>
                      <Input
                        type="number"
                        value={settings.shipping.standardShippingCost}
                        onChange={(e) => updateSettings('shipping', 'standardShippingCost', Number(e.target.value))}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Express Shipping Cost (₹)
                      </label>
                      <Input
                        type="number"
                        value={settings.shipping.expressShippingCost}
                        onChange={(e) => updateSettings('shipping', 'expressShippingCost', Number(e.target.value))}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        COD Charges (₹)
                      </label>
                      <Input
                        type="number"
                        value={settings.shipping.codCharges}
                        onChange={(e) => updateSettings('shipping', 'codCharges', Number(e.target.value))}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Standard Delivery Time
                      </label>
                      <Input
                        value={settings.shipping.deliveryTimeStandard}
                        onChange={(e) => updateSettings('shipping', 'deliveryTimeStandard', e.target.value)}
                        placeholder="3-5 business days"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Express Delivery Time
                      </label>
                      <Input
                        value={settings.shipping.deliveryTimeExpress}
                        onChange={(e) => updateSettings('shipping', 'deliveryTimeExpress', e.target.value)}
                        placeholder="1-2 business days"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="internationalShipping"
                      checked={settings.shipping.internationalShipping}
                      onChange={(e) => updateSettings('shipping', 'internationalShipping', e.target.checked)}
                      className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                    />
                    <label htmlFor="internationalShipping" className="text-sm font-medium text-gray-700">
                      Enable International Shipping
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="razorpayEnabled"
                        checked={settings.payment.razorpayEnabled}
                        onChange={(e) => updateSettings('payment', 'razorpayEnabled', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="razorpayEnabled" className="text-sm font-medium text-gray-700">
                        Razorpay
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="upiEnabled"
                        checked={settings.payment.upiEnabled}
                        onChange={(e) => updateSettings('payment', 'upiEnabled', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="upiEnabled" className="text-sm font-medium text-gray-700">
                        UPI
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="netBankingEnabled"
                        checked={settings.payment.netBankingEnabled}
                        onChange={(e) => updateSettings('payment', 'netBankingEnabled', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="netBankingEnabled" className="text-sm font-medium text-gray-700">
                        Net Banking
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="codEnabled"
                        checked={settings.payment.codEnabled}
                        onChange={(e) => updateSettings('payment', 'codEnabled', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="codEnabled" className="text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoCapture"
                      checked={settings.payment.autoCapture}
                      onChange={(e) => updateSettings('payment', 'autoCapture', e.target.checked)}
                      className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                    />
                    <label htmlFor="autoCapture" className="text-sm font-medium text-gray-700">
                      Auto-capture payments
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="orderConfirmation"
                        checked={settings.notifications.orderConfirmation}
                        onChange={(e) => updateSettings('notifications', 'orderConfirmation', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="orderConfirmation" className="text-sm font-medium text-gray-700">
                        Order Confirmation Emails
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="shipmentUpdates"
                        checked={settings.notifications.shipmentUpdates}
                        onChange={(e) => updateSettings('notifications', 'shipmentUpdates', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="shipmentUpdates" className="text-sm font-medium text-gray-700">
                        Shipment Update Notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lowStockAlerts"
                        checked={settings.notifications.lowStockAlerts}
                        onChange={(e) => updateSettings('notifications', 'lowStockAlerts', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="lowStockAlerts" className="text-sm font-medium text-gray-700">
                        Low Stock Alerts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newOrderAlerts"
                        checked={settings.notifications.newOrderAlerts}
                        onChange={(e) => updateSettings('notifications', 'newOrderAlerts', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="newOrderAlerts" className="text-sm font-medium text-gray-700">
                        New Order Alerts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="marketingEmails"
                        checked={settings.notifications.marketingEmails}
                        onChange={(e) => updateSettings('notifications', 'marketingEmails', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="marketingEmails" className="text-sm font-medium text-gray-700">
                        Marketing Emails
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="twoFactorAuth"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => updateSettings('security', 'twoFactorAuth', e.target.checked)}
                        className="h-4 w-4 text-springz-green focus:ring-springz-green border-gray-300 rounded"
                      />
                      <label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSettings('security', 'sessionTimeout', Number(e.target.value))}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Policy
                      </label>
                      <select
                        value={settings.security.passwordPolicy}
                        onChange={(e) => updateSettings('security', 'passwordPolicy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
                      >
                        <option value="basic">Basic (8+ characters)</option>
                        <option value="medium">Medium (8+ chars, 1 number)</option>
                        <option value="strong">Strong (8+ chars, 1 number, 1 special)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

