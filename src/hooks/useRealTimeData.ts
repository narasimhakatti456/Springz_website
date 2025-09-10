import { useState, useEffect, useCallback } from 'react'

interface UseRealTimeDataOptions {
  endpoint: string
  interval?: number
  enabled?: boolean
}

export function useRealTimeData<T>({ 
  endpoint, 
  interval = 30000, // 30 seconds default
  enabled = true 
}: UseRealTimeDataOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchData()

    // Set up interval for real-time updates
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [fetchData, interval, enabled])

  const refresh = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  }
}

// Specific hooks for different data types
export function useRealTimeProducts() {
  return useRealTimeData({
    endpoint: '/api/admin/products',
    interval: 15000 // 15 seconds for products
  })
}

export function useRealTimeCategories() {
  return useRealTimeData({
    endpoint: '/api/categories',
    interval: 30000 // 30 seconds for categories
  })
}

export function useRealTimeUsers() {
  return useRealTimeData({
    endpoint: '/api/admin/users',
    interval: 20000 // 20 seconds for users
  })
}

export function useRealTimeOrders() {
  return useRealTimeData({
    endpoint: '/api/admin/orders',
    interval: 10000 // 10 seconds for orders
  })
}

export function useRealTimeAnalytics() {
  return useRealTimeData({
    endpoint: '/api/admin/analytics',
    interval: 60000 // 1 minute for analytics
  })
}

