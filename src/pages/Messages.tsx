import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { MessageSquare } from 'lucide-react'

export function Messages() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Messages & Wishes
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-wedding-primary" />
            <span>Guest Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Messages Coming Soon
            </h3>
            <p className="text-gray-500">
              Collect and display heartfelt messages from your guests.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}