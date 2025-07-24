import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { UsersRound } from 'lucide-react'

export function Groups() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Guest Groups
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UsersRound className="h-5 w-5 text-wedding-primary" />
            <span>Organize Guests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UsersRound className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Guest Groups Coming Soon
            </h3>
            <p className="text-gray-500">
              Organize guests into groups like family, friends, and colleagues.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}