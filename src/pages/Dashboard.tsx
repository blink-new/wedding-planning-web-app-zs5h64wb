import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Heart,
  Plus,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface Wedding {
  id: string
  title: string
  brideNname?: string
  groomName?: string
  weddingDate?: string
  venue?: string
  budget?: number
  guestCount: number
  rsvpCount: number
}

interface DashboardStats {
  totalGuests: number
  rsvpReceived: number
  pendingRsvp: number
  totalBudget: number
  upcomingEvents: number
}

export function Dashboard() {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalGuests: 0,
    rsvpReceived: 0,
    pendingRsvp: 0,
    totalBudget: 0,
    upcomingEvents: 0
  })
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      const user = await blink.auth.me()
      
      // Load weddings
      const weddingsData = await blink.db.weddings.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setWeddings(weddingsData)

      // Calculate stats
      const totalGuests = weddingsData.reduce((sum, w) => sum + (w.guestCount || 0), 0)
      const rsvpReceived = weddingsData.reduce((sum, w) => sum + (w.rsvpCount || 0), 0)
      const totalBudget = weddingsData.reduce((sum, w) => sum + (w.budget || 0), 0)

      setStats({
        totalGuests,
        rsvpReceived,
        pendingRsvp: totalGuests - rsvpReceived,
        totalBudget,
        upcomingEvents: weddingsData.length
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const rsvpProgress = stats.totalGuests > 0 ? (stats.rsvpReceived / stats.totalGuests) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-wedding-primary to-wedding-primary-hover rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-2">
              Welcome to Your Wedding Dashboard
            </h1>
            <p className="text-wedding-primary/20">
              Plan your perfect day with ease and elegance
            </p>
          </div>
          <Heart className="h-16 w-16 text-white/20" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-wedding-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              Across all your weddings
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RSVP Received</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rsvpReceived}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingRsvp} still pending
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Planned budget
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-wedding-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Weddings to plan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RSVP Progress */}
      {stats.totalGuests > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-wedding-primary" />
              <span>RSVP Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Responses received</span>
                <span>{stats.rsvpReceived} of {stats.totalGuests}</span>
              </div>
              <Progress value={rsvpProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {rsvpProgress.toFixed(1)}% of guests have responded
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weddings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Weddings</CardTitle>
              <Link to="/wedding-details">
                <Button size="sm" className="bg-wedding-primary hover:bg-wedding-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  New Wedding
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {weddings.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No weddings yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first wedding to get started
                </p>
                <Link to="/wedding-details">
                  <Button className="bg-wedding-primary hover:bg-wedding-primary-hover">
                    Create Wedding
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {weddings.map((wedding) => (
                  <div
                    key={wedding.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {wedding.title}
                        </h3>
                        {wedding.weddingDate && (
                          <p className="text-sm text-gray-500">
                            {new Date(wedding.weddingDate).toLocaleDateString()}
                          </p>
                        )}
                        {wedding.venue && (
                          <p className="text-sm text-gray-500">{wedding.venue}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {wedding.rsvpCount}/{wedding.guestCount} RSVP
                        </p>
                        {wedding.budget && (
                          <p className="text-sm text-gray-500">
                            ${wedding.budget.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/guests">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Guests</span>
                </Button>
              </Link>
              <Link to="/rsvp">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <UserCheck className="h-6 w-6" />
                  <span className="text-sm">Track RSVP</span>
                </Button>
              </Link>
              <Link to="/timeline">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Timeline</span>
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Heart className="h-6 w-6" />
                  <span className="text-sm">Messages</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}