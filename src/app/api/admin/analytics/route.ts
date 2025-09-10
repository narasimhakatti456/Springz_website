import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date ranges
    const now = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get previous period for comparison
    const prevStartDate = new Date(startDate)
    const prevEndDate = new Date(startDate)
    const periodLength = now.getTime() - startDate.getTime()
    prevStartDate.setTime(prevStartDate.getTime() - periodLength)

    // Revenue data
    const currentRevenue = await db.order.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      _sum: { totalInINR: true }
    })

    const previousRevenue = await db.order.aggregate({
      where: {
        createdAt: { gte: prevStartDate, lt: prevEndDate },
        status: { not: 'CANCELLED' }
      },
      _sum: { totalInINR: true }
    })

    const revenueGrowth = previousRevenue._sum.totalInINR 
      ? ((currentRevenue._sum.totalInINR || 0) - (previousRevenue._sum.totalInINR || 0)) / (previousRevenue._sum.totalInINR || 1) * 100
      : 0

    // Orders data
    const currentOrders = await db.order.count({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      }
    })

    const previousOrders = await db.order.count({
      where: {
        createdAt: { gte: prevStartDate, lt: prevEndDate },
        status: { not: 'CANCELLED' }
      }
    })

    const ordersGrowth = previousOrders 
      ? ((currentOrders - previousOrders) / previousOrders) * 100
      : 0

    // Customers data
    const currentCustomers = await db.user.count({
      where: {
        createdAt: { gte: startDate },
        role: 'CUSTOMER'
      }
    })

    const previousCustomers = await db.user.count({
      where: {
        createdAt: { gte: prevStartDate, lt: prevEndDate },
        role: 'CUSTOMER'
      }
    })

    const customersGrowth = previousCustomers 
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
      : 0

    // Products data
    const totalProducts = await db.product.count()

    // Monthly revenue data
    const monthlyRevenue = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        SUM(totalInINR) as revenue
      FROM orders
      WHERE createdAt >= ${startDate} 
        AND status != 'CANCELLED'
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    `

    // Daily revenue data (last 30 days)
    const dailyRevenue = await db.$queryRaw`
      SELECT 
        date(createdAt) as date,
        SUM(totalInINR) as revenue
      FROM orders
      WHERE createdAt >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
        AND status != 'CANCELLED'
      GROUP BY date(createdAt)
      ORDER BY date
    `

    // Monthly orders data
    const monthlyOrders = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as orders
      FROM orders
      WHERE createdAt >= ${startDate}
        AND status != 'CANCELLED'
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    `

    // Order status distribution
    const orderStatus = await db.order.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    // Top selling products
    const topSellingProducts = await db.orderItem.groupBy({
      by: ['productId'],
      _sum: { qty: true },
      _count: { productId: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: 10
    })

    const topProductsWithDetails = await Promise.all(
      topSellingProducts.map(async (item: { productId: string; _sum: { qty: number | null }; _count: { productId: number } }) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          select: { title: true }
        })
        return {
          name: product?.title || 'Unknown Product',
          sales: item._sum.qty || 0,
          revenue: (item._sum.qty || 0) * 1000 // Approximate revenue
        }
      })
    )

    // Products by category
    const productsByCategory = await db.product.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true }
    })

    const categoriesWithDetails = await Promise.all(
      productsByCategory.map(async (item: { categoryId: string; _count: { categoryId: number } }) => {
        const category = await db.category.findUnique({
          where: { id: item.categoryId },
          select: { name: true }
        })
        return {
          category: category?.name || 'Uncategorized',
          count: item._count.categoryId
        }
      })
    )

    // New customers by month
    const newCustomers = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as customers
      FROM users
      WHERE createdAt >= ${startDate}
        AND role = 'CUSTOMER'
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    `

    // Calculate returning customers percentage
    const totalCustomers = await db.user.count({ where: { role: 'CUSTOMER' } })
    const customersWithOrders = await db.user.count({
      where: {
        role: 'CUSTOMER',
        orders: { some: {} }
      }
    })
    const returningPercentage = totalCustomers > 0 ? (customersWithOrders / totalCustomers) * 100 : 0

    const analyticsData = {
      revenue: {
        total: currentRevenue._sum.totalInINR || 0,
        growth: Math.round(revenueGrowth * 100) / 100,
        monthly: monthlyRevenue,
        daily: dailyRevenue
      },
      orders: {
        total: currentOrders,
        growth: Math.round(ordersGrowth * 100) / 100,
        monthly: monthlyOrders,
        status: orderStatus.map((item: { status: string; _count: { status: number } }) => ({
          status: item.status,
          count: item._count.status
        }))
      },
      products: {
        total: totalProducts,
        topSelling: topProductsWithDetails,
        categories: categoriesWithDetails
      },
      customers: {
        total: totalCustomers,
        growth: Math.round(customersGrowth * 100) / 100,
        newCustomers: newCustomers,
        returning: Math.round(returningPercentage * 100) / 100
      }
    }

    // Convert BigInt values to numbers for JSON serialization
    const serializedData = JSON.parse(JSON.stringify(analyticsData, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ))

    return NextResponse.json(serializedData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
