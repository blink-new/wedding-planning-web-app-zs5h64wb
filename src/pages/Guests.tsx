import React, { useState, useEffect } from 'react'
import { Plus, Upload, Search, Filter, Phone, Mail, MoreHorizontal } from 'lucide-react'
import { blink } from '../blink/client'

interface Guest {
  id: string
  firstName: string
  lastName?: string
  phoneNumber: string
  email?: string
  notes?: string
  createdAt: string
}

export function Guests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddGuest, setShowAddGuest] = useState(false)

  const loadGuests = async () => {
    try {
      const user = await blink.auth.me()
      const guestsList = await blink.db.guests.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setGuests(guestsList)
    } catch (error) {
      console.error('Error loading guests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [])

  const filteredGuests = guests.filter(guest => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      guest.firstName.toLowerCase().includes(searchTerm) ||
      (guest.lastName && guest.lastName.toLowerCase().includes(searchTerm)) ||
      guest.phoneNumber.includes(searchTerm) ||
      (guest.email && guest.email.toLowerCase().includes(searchTerm))
    )
  })

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Guests</h1>
          <p className="text-gray-600">Manage your guest list and contact information</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddGuest(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="all">All Guests</option>
              <option value="with-email">With Email</option>
              <option value="without-email">Without Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{guests.length}</div>
          <div className="text-sm text-gray-600">Total Guests</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {guests.filter(g => g.email).length}
          </div>
          <div className="text-sm text-gray-600">With Email</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {guests.filter(g => g.phoneNumber).length}
          </div>
          <div className="text-sm text-gray-600">With Phone</div>
        </div>
      </div>

      {/* Guests List */}
      {filteredGuests.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Phone</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Added</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {guest.firstName} {guest.lastName}
                      </div>
                      {guest.notes && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {guest.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-gray-900">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {guest.phoneNumber}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {guest.email ? (
                        <div className="flex items-center text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {guest.email}
                        </div>
                      ) : (
                        <span className="text-gray-400">No email</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {new Date(guest.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first guest or importing from CSV'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowAddGuest(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Add Your First Guest
            </button>
          )}
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddGuest && (
        <AddGuestModal 
          onClose={() => setShowAddGuest(false)}
          onAdded={() => {
            setShowAddGuest(false)
            loadGuests()
          }}
        />
      )}
    </div>
  )
}

// Add Guest Modal Component
interface AddGuestModalProps {
  onClose: () => void
  onAdded: () => void
}

function AddGuestModal({ onClose, onAdded }: AddGuestModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !phoneNumber.trim()) return

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      await blink.db.guests.create({
        id: `guest_${Date.now()}`,
        eventId: 'default', // You'd get this from context
        userId: user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        notes: notes.trim() || undefined
      })

      onAdded()
    } catch (error) {
      console.error('Error adding guest:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Guest</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
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
              disabled={!firstName.trim() || !phoneNumber.trim() || loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Guest'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}