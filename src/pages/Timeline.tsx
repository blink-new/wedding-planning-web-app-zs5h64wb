import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Clock } from 'lucide-react'

export function Timeline() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Wedding Timeline
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-wedding-primary" />
            <span>Event Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Timeline Coming Soon
            </h3>
            <p className="text-gray-500">
              Plan your wedding day timeline and schedule events.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}