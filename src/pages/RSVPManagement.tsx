import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { UserCheck } from 'lucide-react'

export function RSVPManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          RSVP Management
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-wedding-primary" />
            <span>RSVP Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              RSVP Management Coming Soon
            </h3>
            <p className="text-gray-500">
              Track guest responses, meal preferences, and plus-ones.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}