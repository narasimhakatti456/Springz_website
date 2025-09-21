'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Search, Users, UserCheck, UserX, Mail, Phone, RefreshCw, Clock } from 'lucide-react'
import { useRealTimeUsers } from '@/hooks/useRealTimeData'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  _count: {
    orders: number
    reviews: number
  }
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const { 
    data: usersData, 
    loading, 
    error, 
    lastUpdated, 
    refresh 
  } = useRealTimeUsers()

  const users = (usersData as any)?.users || []

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        refresh()
      } else {
        alert('Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Something went wrong')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error'
      case 'CUSTOMER':
        return 'default'
      default:
        return 'default'
    }
  }

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const stats = {
    totalUsers: users.length,
    admins: users.filter((u: any) => u.role === 'ADMIN').length,
    customers: users.filter((u: any) => u.role === 'CUSTOMER').length,
    newThisWeek: users.filter((u: any) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(u.createdAt) > weekAgo
    }).length
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">Manage user accounts and roles</p>
          {lastUpdated && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-springz-green focus:border-springz-green"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CUSTOMER">Customer</option>
        </select>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user: any) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-springz-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-springz-green">
                    {user.name || 'No Name'}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <Badge variant={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                {user.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="text-sm text-gray-600">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span>Orders: {user._count.orders}</span>
                <span>Reviews: {user._count.reviews}</span>
              </div>

              <div className="flex space-x-2">
                {user.role === 'CUSTOMER' ? (
                  <Button
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'ADMIN')}
                    className="flex-1"
                  >
                    Make Admin
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateUserRole(user.id, 'CUSTOMER')}
                    className="flex-1"
                  >
                    Make Customer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  )
}
