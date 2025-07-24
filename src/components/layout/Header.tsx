import React from 'react'
import { Bell, User, LogOut } from 'lucide-react'
import { blink } from '../../blink/client'

interface User {
  id: string
  email: string
  displayName?: string
}

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-sm text-gray-600">
            Manage your wedding communications
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={() => blink.auth.logout()}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}