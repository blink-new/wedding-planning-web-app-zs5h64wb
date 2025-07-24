import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Send, 
  Clock, 
  Users, 
  MessageSquare,
  Calendar,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react'
import { blink } from '../blink/client'

interface Message {
  id: string
  subject?: string
  content: string
  messageType: string
  status: string
  scheduledAt?: string
  sentAt?: string
  recipientCount: number
  deliveryCount: number
  replyCount: number
  createdAt: string
}

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showComposer, setShowComposer] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const loadMessages = async () => {
    try {
      const user = await blink.auth.me()
      const messagesList = await blink.db.messages.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setMessages(messagesList)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter
    const matchesSearch = message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-orange-100 text-orange-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="w-4 h-4" />
      case 'scheduled':
        return <Clock className="w-4 h-4" />
      case 'draft':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Send broadcasts and manage your communications</p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Drafts</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length > 0 ? (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span className="capitalize">{message.status}</span>
                    </div>
                    {message.messageType === 'scheduled' && message.scheduledAt && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(message.scheduledAt).toLocaleDateString()} at {new Date(message.scheduledAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {message.subject || 'No Subject'}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {message.content}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {message.recipientCount} recipients
                    </div>
                    {message.deliveryCount > 0 && (
                      <div className="flex items-center">
                        <Send className="w-4 h-4 mr-1" />
                        {message.deliveryCount} delivered
                      </div>
                    )}
                    {message.replyCount > 0 && (
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {message.replyCount} replies
                      </div>
                    )}
                    <div>
                      Created {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by sending your first message to your guests'
            }
          </p>
          {!searchQuery && filter === 'all' && (
            <button
              onClick={() => setShowComposer(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Send Your First Message
            </button>
          )}
        </div>
      )}

      {/* Message Composer Modal */}
      {showComposer && (
        <MessageComposer 
          onClose={() => setShowComposer(false)}
          onSent={() => {
            setShowComposer(false)
            loadMessages()
          }}
        />
      )}
    </div>
  )
}

// Message Composer Component
interface MessageComposerProps {
  onClose: () => void
  onSent: () => void
}

function MessageComposer({ onClose, onSent }: MessageComposerProps) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [messageType, setMessageType] = useState('broadcast')
  const [scheduledAt, setScheduledAt] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadGroups = async () => {
    try {
      const user = await blink.auth.me()
      const groupsList = await blink.db.guestGroups.list({
        where: { userId: user.id }
      })
      setGroups(groupsList)
    } catch (error) {
      console.error('Error loading groups:', error)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const handleSend = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      // For now, we'll create a draft message
      // In a real implementation, this would integrate with Twilio
      await blink.db.messages.create({
        id: `msg_${Date.now()}`,
        eventId: 'default', // You'd get this from context
        userId: user.id,
        subject: subject || undefined,
        content: content.trim(),
        messageType,
        status: messageType === 'scheduled' ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt || undefined,
        recipientCount: selectedGroups.length > 0 ? selectedGroups.length * 10 : 0, // Mock count
        deliveryCount: 0,
        replyCount: 0
      })

      onSent()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Compose Message</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Message Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="broadcast">Send Now</option>
              <option value="scheduled">Schedule for Later</option>
            </select>
          </div>

          {/* Scheduled Date/Time */}
          {messageType === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGroups.includes('all')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedGroups(['all'])
                    } else {
                      setSelectedGroups([])
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">All Guests</span>
              </label>
              {groups.map((group) => (
                <label key={group.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGroups([...selectedGroups.filter(id => id !== 'all'), group.id])
                      } else {
                        setSelectedGroups(selectedGroups.filter(id => id !== group.id))
                      }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">{group.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {content.length}/160 characters
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!content.trim() || loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {messageType === 'scheduled' ? 'Schedule Message' : 'Send Message'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}