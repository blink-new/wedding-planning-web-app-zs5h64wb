import React, { useState, useEffect } from 'react'
import { Plus, FileText, Edit, Trash2, Copy } from 'lucide-react'
import { blink } from '../blink/client'

interface Template {
  id: string
  name: string
  content: string
  category: string
  isSystem: boolean
  createdAt: string
}

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const loadTemplates = async () => {
    try {
      const user = await blink.auth.me()
      const templatesList = await blink.db.messageTemplates.list({
        where: { 
          OR: [
            { userId: user.id },
            { isSystem: 1 }
          ]
        },
        orderBy: { createdAt: 'desc' }
      })
      setTemplates(templatesList.map(t => ({
        ...t,
        isSystem: Number(t.isSystem) > 0
      })))
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  const filteredTemplates = templates.filter(template => {
    if (filter === 'all') return true
    if (filter === 'system') return template.isSystem
    if (filter === 'custom') return !template.isSystem
    return template.category === filter
  })

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'system', label: 'System Templates' },
    { value: 'custom', label: 'My Templates' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'rsvp', label: 'RSVP' },
    { value: 'general', label: 'General' }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Templates</h1>
          <p className="text-gray-600">Pre-written messages to save time and ensure consistency</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Category:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  {!template.isSystem && (
                    <>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{template.content}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.isSystem 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {template.isSystem ? 'System' : 'Custom'}
                </span>
                <span className="text-gray-500 capitalize">{template.category}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">
            {filter !== 'all' 
              ? 'Try selecting a different category'
              : 'Create your first template to save time on messaging'
            }
          </p>
          {filter === 'all' && (
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Create Your First Template
            </button>
          )}
        </div>
      )}
    </div>
  )
}