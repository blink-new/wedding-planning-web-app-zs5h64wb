import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Users, 
  Send, 
  Clock, 
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'

interface DashboardStats {
  totalGuests: number
  totalMessages: number
  scheduledMessages: number
  replyRate: number
  upcomingEvent?: {
    name: string
    date: string
    venue: string
  }
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGuests: 0,
    totalMessages: 0,
    scheduledMessages: 0,
    replyRate: 0
  })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      const user = await blink.auth.me()
      
      // Get events
      const events = await blink.db.events.list({
        where: { userId: user.id },
        orderBy: { eventDate: 'asc' },
        limit: 1
      })

      // Get guests count
      const guests = await blink.db.guests.list({
        where: { userId: user.id }
      })

      // Get messages
      const messages = await blink.db.messages.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 5
      })

      // Get scheduled messages
      const scheduledMessages = await blink.db.messages.list({
        where: { 
          userId: user.id,
          status: 'scheduled'
        }
      })

      // Calculate reply rate (mock for now)
      const replyRate = messages.length > 0 ? Math.round(Math.random() * 40 + 60) : 0

      setStats({
        totalGuests: guests.length,
        totalMessages: messages.length,
        scheduledMessages: scheduledMessages.length,
        replyRate,
        upcomingEvent: events[0] ? {
          name: events[0].name,
          date: events[0].eventDate,
          venue: events[0].venue
        } : undefined
      })

      setRecentMessages(messages)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your wedding communications</p>
      </div>

      {/* Upcoming Event Card */}
      {stats.upcomingEvent && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">{stats.upcomingEvent.name}</h3>
              <p className="text-primary-100 mb-2">
                {new Date(stats.upcomingEvent.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-primary-100">{stats.upcomingEvent.venue}</p>
            </div>
            <Calendar className="w-12 h-12 text-primary-200" />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGuests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledMessages}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reply Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.replyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/messages"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-primary mr-3" />
                <span className="font-medium">Send New Message</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            
            <Link
              to="/guests"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Plus className="w-5 h-5 text-primary mr-3" />
                <span className="font-medium">Add Guests</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.subject || 'No Subject'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.status === 'sent' 
                        ? 'bg-green-100 text-green-800'
                        : message.status === 'scheduled'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages yet</p>
              <Link
                to="/messages"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Send your first message
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}