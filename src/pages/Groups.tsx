import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Users, Edit, Trash2, Crown, Heart, UserCheck, UsersRound } from 'lucide-react'
import { blink } from '../blink/client'

interface Group {
  id: string
  name: string
  description?: string
  color: string
  createdAt: string
  memberCount?: number
  isDefault?: boolean
}

const defaultGroups = [
  {
    name: 'All Guests',
    description: 'Everyone invited to your wedding',
    color: '#019592',
    icon: UsersRound
  },
  {
    name: 'Family',
    description: 'Close family members from both sides',
    color: '#8B5A3C',
    icon: Heart
  },
  {
    name: 'Friends',
    description: 'Close friends and college buddies',
    color: '#D4AF37',
    icon: Users
  },
  {
    name: 'Bridal Party',
    description: 'Bridesmaids, groomsmen, and wedding party',
    color: '#E91E63',
    icon: Crown
  }
]

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const createDefaultGroups = async (userId: string) => {
    try {
      console.log('createDefaultGroups called for user:', userId)
      // First, ensure we have a default event
      let defaultEvent
      try {
        console.log('Checking for existing events...')
        const existingEvents = await blink.db.events.list({
          where: { user_id: userId },
          limit: 1
        })
        console.log('Existing events:', existingEvents)
        
        if (existingEvents.length === 0) {
          console.log('No events found, creating default event...')
          // Create a default event
          defaultEvent = await blink.db.events.create({
            id: `event_${userId}_default`,
            user_id: userId,
            bride_name: 'Bride',
            groom_name: 'Groom',
            wedding_date: new Date().toISOString().split('T')[0],
            venue: 'Wedding Venue',
            created_at: new Date().toISOString()
          })
          console.log('Created default event:', defaultEvent)
        } else {
          defaultEvent = existingEvents[0]
          console.log('Using existing event:', defaultEvent)
        }
      } catch (error) {
        console.error('Error with events:', error)
        return
      }

      // Now create default groups
      console.log('Creating default groups for event:', defaultEvent.id)
      for (const defaultGroup of defaultGroups) {
        const groupId = `group_${userId}_${defaultGroup.name.toLowerCase().replace(/\s+/g, '_')}`
        console.log(`Processing group: ${defaultGroup.name} with ID: ${groupId}`)
        
        // Check if group already exists
        const existingGroups = await blink.db.guest_groups.list({
          where: { 
            user_id: userId,
            name: defaultGroup.name
          }
        })
        console.log(`Existing ${defaultGroup.name} groups:`, existingGroups)
        
        if (existingGroups.length === 0) {
          console.log(`Creating group: ${defaultGroup.name}`)
          const newGroup = await blink.db.guest_groups.create({
            id: groupId,
            event_id: defaultEvent.id,
            user_id: userId,
            name: defaultGroup.name,
            description: defaultGroup.description,
            color: defaultGroup.color,
            is_default: true,
            created_at: new Date().toISOString()
          })
          console.log(`Created group:`, newGroup)
        } else {
          console.log(`Group ${defaultGroup.name} already exists`)
        }
      }
      console.log('Finished creating default groups')
    } catch (error) {
      console.error('Error creating default groups:', error)
    }
  }

  const loadGroups = useCallback(async () => {
    try {
      console.log('Loading groups...')
      const user = await blink.auth.me()
      console.log('Current user:', user)
      
      // Create default groups if they don't exist
      console.log('Creating default groups...')
      await createDefaultGroups(user.id)
      
      console.log('Fetching groups from database...')
      const groupsList = await blink.db.guest_groups.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      })
      console.log('Groups from database:', groupsList)
      
      // Mark default groups and add member counts
      const groupsWithMetadata = groupsList.map(group => ({
        ...group,
        isDefault: defaultGroups.some(dg => dg.name === group.name),
        memberCount: 0 // TODO: Calculate actual member count
      }))
      
      // Sort groups to show default groups first
      const sortedGroups = groupsWithMetadata.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1
        if (!a.isDefault && b.isDefault) return 1
        return 0
      })
      
      console.log('Final sorted groups:', sortedGroups)
      setGroups(sortedGroups)
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  const getGroupIcon = (groupName: string) => {
    const defaultGroup = defaultGroups.find(dg => dg.name === groupName)
    return defaultGroup?.icon || Users
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const defaultGroupsList = groups.filter(group => group.isDefault)
  const customGroupsList = groups.filter(group => !group.isDefault)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Guest Groups</h1>
          <p className="text-gray-600">Organize your guests into groups for targeted messaging</p>
        </div>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </button>
      </div>

      {/* Default Groups Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <UserCheck className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Default Groups</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Pre-built
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultGroupsList.map((group) => {
            const IconComponent = getGroupIcon(group.name)
            return (
              <div 
                key={group.id} 
                className="bg-white rounded-xl border-2 p-6 hover:shadow-md transition-all duration-200"
                style={{ borderColor: group.color + '20' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: group.color + '20' }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: group.color }} />
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {group.memberCount || 0} members
                  </div>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Manage
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Groups Section */}
      {customGroupsList.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Custom Groups</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customGroupsList.map((group) => (
              <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: group.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {group.description && (
                  <p className="text-gray-600 mb-4">{group.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {group.memberCount || 0} members
                  </div>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Custom Groups */}
      {customGroupsList.length === 0 && defaultGroupsList.length > 0 && (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Groups</h3>
          <p className="text-gray-600 mb-4">
            Add custom groups like "College Friends", "Work Colleagues", or "Neighbors"
          </p>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Custom Group
          </button>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)}
          onCreated={() => {
            setShowCreateGroup(false)
            loadGroups()
          }}
        />
      )}
    </div>
  )
}

// Create Group Modal Component
interface CreateGroupModalProps {
  onClose: () => void
  onCreated: () => void
}

function CreateGroupModal({ onClose, onCreated }: CreateGroupModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#019592')
  const [loading, setLoading] = useState(false)

  const colors = [
    '#019592', '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      // Get the user's event
      const existingEvents = await blink.db.events.list({
        where: { user_id: user.id },
        limit: 1
      })
      
      let eventId = 'default'
      if (existingEvents.length > 0) {
        eventId = existingEvents[0].id
      }
      
      await blink.db.guest_groups.create({
        id: `group_${Date.now()}`,
        event_id: eventId,
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        is_default: false,
        created_at: new Date().toISOString()
      })

      onCreated()
    } catch (error) {
      console.error('Error creating group:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Custom Group</h2>
          <p className="text-sm text-gray-600 mt-1">Add a new group to organize your guests</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., College Friends, Work Colleagues"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this group"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}