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

    // Get dashboard statistics
    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total Revenue
      db.order.aggregate({
        where: {
          paymentStatus: 'PAID'
        },
        _sum: {
          totalInINR: true
        }
      }),
      
      // Total Orders
      db.order.count(),
      
      // Total Users
      db.user.count({
        where: {
          role: 'CUSTOMER'
        }
      }),
      
      // Total Products
      db.product.count(),
      
      // Recent Orders
      db.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }),
      
      // Top Products (by order items)
      db.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          qty: true,
          priceInINR: true
        },
        orderBy: {
          _sum: {
            qty: 'desc'
          }
        },
        take: 5
      })
    ])

    // Get product details for top products
    const topProductIds = topProducts.map(p => p.productId)
    const topProductDetails = await db.product.findMany({
      where: {
        id: {
          in: topProductIds
        }
      },
      select: {
        id: true,
        title: true
      }
    })

    const topProductsWithDetails = topProducts.map(item => {
      const product = topProductDetails.find(p => p.id === item.productId)
      return {
        id: item.productId,
        title: product?.title || 'Unknown Product',
        totalSold: item._sum.qty || 0,
        revenue: (item._sum.qty || 0) * (item._sum.priceInINR || 0)
      }
    })

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalInINR || 0,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      topProducts: topProductsWithDetails
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

