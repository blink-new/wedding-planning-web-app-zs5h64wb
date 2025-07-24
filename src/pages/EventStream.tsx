import React from 'react'
import { Radio, Heart, Camera, MessageSquare, Share2 } from 'lucide-react'

export function EventStream() {
  const mockReplies = [
    {
      id: 1,
      guest: 'Sarah Johnson',
      content: 'So excited for your big day! Can\'t wait to celebrate with you both! 💕',
      timestamp: '2 hours ago',
      hasImage: false
    },
    {
      id: 2,
      guest: 'Mike Chen',
      content: 'Just arrived at the venue - it looks absolutely stunning!',
      timestamp: '3 hours ago',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      guest: 'Emily Davis',
      content: 'Thank you for including us in your special day. The ceremony was beautiful!',
      timestamp: '5 hours ago',
      hasImage: false
    },
    {
      id: 4,
      guest: 'David Wilson',
      content: 'Amazing food and great music! Having such a wonderful time.',
      timestamp: '6 hours ago',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop'
    }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Event Stream</h1>
        <p className="text-gray-600">See what your guests are sharing in real-time</p>
      </div>

      {/* Stream Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Radio className="w-5 h-5 text-primary mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Event Stream</h3>
              <p className="text-sm text-gray-600">Allow guests to see each other's replies and photos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Enable public stream</span>
            </label>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </button>
          </div>
        </div>
      </div>

      {/* Stream Feed */}
      <div className="space-y-6">
        {mockReplies.map((reply) => (
          <div key={reply.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                {reply.guest.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{reply.guest}</h4>
                  <span className="text-sm text-gray-500">{reply.timestamp}</span>
                </div>
                
                <p className="text-gray-700 mb-3">{reply.content}</p>
                
                {reply.hasImage && reply.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={reply.imageUrl} 
                      alt="Guest photo"
                      className="rounded-lg max-w-sm w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4 mr-1" />
                    Like
                  </button>
                  <button className="flex items-center hover:text-blue-500 transition-colors">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Reply
                  </button>
                  {reply.hasImage && (
                    <div className="flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for when no replies */}
      {mockReplies.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
          <p className="text-gray-600 mb-6">
            Guest replies and photos will appear here when they start sharing
          </p>
        </div>
      )}
    </div>
  )
}