import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Heart } from 'lucide-react'

export function GuestPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-primary/10 to-wedding-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Heart className="h-16 w-16 text-wedding-primary mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              Guest Portal
            </h1>
            <p className="text-gray-600">
              RSVP and share your excitement for the special day
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Guest Portal Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  This is where guests will be able to:
                </p>
                <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                  <li>• RSVP to the wedding</li>
                  <li>• Select meal preferences</li>
                  <li>• Add plus-one information</li>
                  <li>• Leave messages for the couple</li>
                  <li>• View wedding details</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}