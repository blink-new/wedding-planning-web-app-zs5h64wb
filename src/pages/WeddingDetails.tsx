import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Calendar, Heart, MapPin, DollarSign } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface Wedding {
  id?: string
  title: string
  brideName: string
  groomName: string
  weddingDate: string
  venue: string
  description: string
  budget: number
}

export function WeddingDetails() {
  const [wedding, setWedding] = useState<Wedding>({
    title: '',
    brideName: '',
    groomName: '',
    weddingDate: '',
    venue: '',
    description: '',
    budget: 0
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const loadWeddingDetails = async () => {
    try {
      setLoading(true)
      const user = await blink.auth.me()
      
      // Load the first wedding for this user
      const weddings = await blink.db.weddings.list({
        where: { userId: user.id },
        limit: 1,
        orderBy: { createdAt: 'desc' }
      })

      if (weddings.length > 0) {
        const w = weddings[0]
        setWedding({
          id: w.id,
          title: w.title || '',
          brideName: w.brideName || '',
          groomName: w.groomName || '',
          weddingDate: w.weddingDate || '',
          venue: w.venue || '',
          description: w.description || '',
          budget: w.budget || 0
        })
      }
    } catch (error) {
      console.error('Error loading wedding details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeddingDetails()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const user = await blink.auth.me()

      const weddingData = {
        ...wedding,
        userId: user.id,
        updatedAt: new Date().toISOString()
      }

      if (wedding.id) {
        // Update existing wedding
        await blink.db.weddings.update(wedding.id, weddingData)
        toast({
          title: "Wedding Updated",
          description: "Your wedding details have been saved successfully.",
        })
      } else {
        // Create new wedding
        const newWedding = await blink.db.weddings.create({
          id: `wedding_${Date.now()}`,
          ...weddingData,
          guestCount: 0,
          rsvpCount: 0,
          createdAt: new Date().toISOString()
        })
        setWedding({ ...wedding, id: newWedding.id })
        toast({
          title: "Wedding Created",
          description: "Your wedding has been created successfully.",
        })
      }
    } catch (error) {
      console.error('Error saving wedding:', error)
      toast({
        title: "Error",
        description: "Failed to save wedding details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof Wedding, value: string | number) => {
    setWedding(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Wedding Details
        </h1>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-wedding-primary hover:bg-wedding-primary-hover"
        >
          {saving ? 'Saving...' : 'Save Details'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-wedding-primary" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Wedding Title</Label>
              <Input
                id="title"
                value={wedding.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Sarah & John's Wedding"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brideName">Bride's Name</Label>
                <Input
                  id="brideName"
                  value={wedding.brideName}
                  onChange={(e) => handleInputChange('brideName', e.target.value)}
                  placeholder="Bride's name"
                />
              </div>
              <div>
                <Label htmlFor="groomName">Groom's Name</Label>
                <Input
                  id="groomName"
                  value={wedding.groomName}
                  onChange={(e) => handleInputChange('groomName', e.target.value)}
                  placeholder="Groom's name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="weddingDate">Wedding Date</Label>
              <Input
                id="weddingDate"
                type="date"
                value={wedding.weddingDate}
                onChange={(e) => handleInputChange('weddingDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={wedding.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your special day..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Venue & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-wedding-primary" />
              <span>Venue & Budget</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={wedding.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Wedding venue location"
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="budget"
                  type="number"
                  value={wedding.budget}
                  onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Wedding Preview */}
            {wedding.title && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Preview</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>{wedding.title}</strong></p>
                  {wedding.brideName && wedding.groomName && (
                    <p>{wedding.brideName} & {wedding.groomName}</p>
                  )}
                  {wedding.weddingDate && (
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(wedding.weddingDate).toLocaleDateString()}
                    </p>
                  )}
                  {wedding.venue && (
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {wedding.venue}
                    </p>
                  )}
                  {wedding.budget > 0 && (
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${wedding.budget.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}