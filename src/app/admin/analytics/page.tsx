'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Download,
  Calendar,
  Eye,
  Star
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    growth: number
    monthly: Array<{ month: string; revenue: number }>
    daily: Array<{ date: string; revenue: number }>
  }
  orders: {
    total: number
    growth: number
    monthly: Array<{ month: string; orders: number }>
    status: Array<{ status: string; count: number }>
  }
  products: {
    total: number
    topSelling: Array<{ name: string; sales: number; revenue: number }>
    categories: Array<{ category: string; count: number }>
  }
  customers: {
    total: number
    growth: number
    newCustomers: Array<{ month: string; customers: number }>
    returning: number
  }
}

const COLORS = ['#2D5016', '#CC7A00', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    if (!data) return
    
    const csvContent = [
      ['Metric', 'Value', 'Growth'],
      ['Total Revenue', data.revenue.total, `${data.revenue.growth}%`],
      ['Total Orders', data.orders.total, `${data.orders.growth}%`],
      ['Total Customers', data.customers.total, `${data.customers.growth}%`],
      ['Total Products', data.products.total, 'N/A']
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${timeRange}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.revenue.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.revenue.growth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={data.revenue.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(data.revenue.growth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.orders.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.orders.growth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={data.orders.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(data.orders.growth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.customers.growth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={data.customers.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(data.customers.growth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.products.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Eye className="h-3 w-3 mr-1" />
              <span>Active products</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenue.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2D5016" 
                  fill="#2D5016" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.orders.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#CC7A00" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.products.topSelling} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [value, 'Sales']} />
                <Bar dataKey="sales" fill="#2D5016" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.orders.status}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.orders.status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.products.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold text-springz-green">{category.category}</h3>
                  <p className="text-sm text-gray-600">{category.count} products</p>
                </div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold" 
                     style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                  {category.count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.customers.newCustomers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Returning Customers</span>
                <Badge variant="default">{data.customers.returning}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">New Customers</span>
                <Badge variant="secondary">{100 - data.customers.returning}%</Badge>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Customer retention is {data.customers.returning}%, indicating strong brand loyalty 
                  and customer satisfaction with our products.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

