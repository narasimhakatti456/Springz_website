'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { LogOut, Bell, Settings } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-springz-green">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Springz Nutrition Management</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="h-5 w-5" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

