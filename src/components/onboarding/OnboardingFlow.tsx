import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Heart, Users, MapPin, Camera, MessageCircle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { blink } from '@/blink/client'

interface OnboardingData {
  // Step 1: Wedding Basics
  brideName: string
  groomName: string
  weddingDate: Date | undefined
  venue: string
  budget: string
  
  // Step 2: Wedding Style & Preferences
  weddingStyle: string
  guestCount: string
  ceremony: string
  reception: string
  
  // Step 3: Planning Priorities
  priorities: string[]
  timeline: string
  notes: string
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
}

// Welcome Step Component
const WelcomeStep: React.FC<any> = ({ onNext }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-wedding-primary/10 rounded-full flex items-center justify-center">
        <Heart className="w-12 h-12 text-wedding-primary" />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Congratulations on your engagement! 🎉
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We're here to help you plan the wedding of your dreams. This quick setup will help us 
          understand your vision and create a personalized planning experience just for you.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <Users className="w-8 h-8 text-wedding-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">Guest Management</p>
          </div>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-wedding-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">Venue Planning</p>
          </div>
          <div className="text-center">
            <MessageCircle className="w-8 h-8 text-wedding-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">RSVP Tracking</p>
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="w-full bg-wedding-primary hover:bg-wedding-primary/90">
        Let's Get Started
      </Button>
    </div>
  )
}

// Basics Step Component
const BasicsStep: React.FC<any> = ({ data, updateData, onNext, onPrev }) => {
  const [date, setDate] = useState<Date | undefined>(data.weddingDate)

  const handleNext = () => {
    if (data.brideName && data.groomName && data.weddingDate) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brideName">Bride's Name *</Label>
          <Input
            id="brideName"
            value={data.brideName}
            onChange={(e) => updateData({ brideName: e.target.value })}
            placeholder="Enter bride's name"
            className="border-gray-300 focus:border-wedding-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groomName">Groom's Name *</Label>
          <Input
            id="groomName"
            value={data.groomName}
            onChange={(e) => updateData({ groomName: e.target.value })}
            placeholder="Enter groom's name"
            className="border-gray-300 focus:border-wedding-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Wedding Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-300",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick your wedding date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                updateData({ weddingDate: selectedDate })
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue (Optional)</Label>
        <Input
          id="venue"
          value={data.venue}
          onChange={(e) => updateData({ venue: e.target.value })}
          placeholder="Wedding venue or location"
          className="border-gray-300 focus:border-wedding-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Estimated Budget (Optional)</Label>
        <Select value={data.budget} onValueChange={(value) => updateData({ budget: value })}>
          <SelectTrigger className="border-gray-300 focus:border-wedding-primary">
            <SelectValue placeholder="Select your budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">Under $5,000</SelectItem>
            <SelectItem value="10000">$5,000 - $10,000</SelectItem>
            <SelectItem value="20000">$10,000 - $20,000</SelectItem>
            <SelectItem value="35000">$20,000 - $35,000</SelectItem>
            <SelectItem value="50000">$35,000 - $50,000</SelectItem>
            <SelectItem value="75000">$50,000 - $75,000</SelectItem>
            <SelectItem value="100000">$75,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex-1 bg-wedding-primary hover:bg-wedding-primary/90"
          disabled={!data.brideName || !data.groomName || !data.weddingDate}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

// Style Step Component
const StyleStep: React.FC<any> = ({ data, updateData, onNext, onPrev }) => {
  const weddingStyles = [
    'Classic & Traditional',
    'Modern & Contemporary',
    'Rustic & Country',
    'Beach & Destination',
    'Garden & Outdoor',
    'Vintage & Retro',
    'Bohemian & Free-spirited',
    'Glamorous & Luxurious'
  ]

  const handleNext = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Wedding Style</Label>
        <Select value={data.weddingStyle} onValueChange={(value) => updateData({ weddingStyle: value })}>
          <SelectTrigger className="border-gray-300 focus:border-wedding-primary">
            <SelectValue placeholder="Choose your wedding style" />
          </SelectTrigger>
          <SelectContent>
            {weddingStyles.map((style) => (
              <SelectItem key={style} value={style}>{style}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Expected Guest Count</Label>
        <Select value={data.guestCount} onValueChange={(value) => updateData({ guestCount: value })}>
          <SelectTrigger className="border-gray-300 focus:border-wedding-primary">
            <SelectValue placeholder="How many guests?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">Intimate (Under 25)</SelectItem>
            <SelectItem value="50">Small (25-50)</SelectItem>
            <SelectItem value="100">Medium (50-100)</SelectItem>
            <SelectItem value="150">Large (100-150)</SelectItem>
            <SelectItem value="200">Very Large (150+)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ceremony">Ceremony Location (Optional)</Label>
        <Input
          id="ceremony"
          value={data.ceremony}
          onChange={(e) => updateData({ ceremony: e.target.value })}
          placeholder="Where will the ceremony take place?"
          className="border-gray-300 focus:border-wedding-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reception">Reception Location (Optional)</Label>
        <Input
          id="reception"
          value={data.reception}
          onChange={(e) => updateData({ reception: e.target.value })}
          placeholder="Where will the reception be held?"
          className="border-gray-300 focus:border-wedding-primary"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1 bg-wedding-primary hover:bg-wedding-primary/90">
          Continue
        </Button>
      </div>
    </div>
  )
}

// Priorities Step Component
const PrioritiesStep: React.FC<any> = ({ data, updateData, onNext, onPrev }) => {
  const priorityOptions = [
    'Photography & Videography',
    'Venue & Catering',
    'Music & Entertainment',
    'Flowers & Decorations',
    'Wedding Dress & Attire',
    'Guest Experience',
    'Honeymoon Planning',
    'Budget Management'
  ]

  const togglePriority = (priority: string) => {
    const currentPriorities = data.priorities || []
    const updated = currentPriorities.includes(priority)
      ? currentPriorities.filter((p: string) => p !== priority)
      : [...currentPriorities, priority]
    updateData({ priorities: updated })
  }

  const handleNext = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>What are your top planning priorities? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {priorityOptions.map((priority) => (
            <button
              key={priority}
              onClick={() => togglePriority(priority)}
              className={cn(
                "p-3 text-left rounded-lg border-2 transition-all duration-200",
                data.priorities?.includes(priority)
                  ? "border-wedding-primary bg-wedding-primary/10 text-wedding-primary"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{priority}</span>
                {data.priorities?.includes(priority) && (
                  <CheckCircle className="w-4 h-4 text-wedding-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Planning Timeline</Label>
        <Select value={data.timeline} onValueChange={(value) => updateData({ timeline: value })}>
          <SelectTrigger className="border-gray-300 focus:border-wedding-primary">
            <SelectValue placeholder="How much time do you have?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 months or less</SelectItem>
            <SelectItem value="6months">3-6 months</SelectItem>
            <SelectItem value="12months">6-12 months</SelectItem>
            <SelectItem value="18months">12-18 months</SelectItem>
            <SelectItem value="24months">18+ months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
          placeholder="Any special requests, themes, or important details..."
          className="border-gray-300 focus:border-wedding-primary min-h-[100px]"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1 bg-wedding-primary hover:bg-wedding-primary/90">
          Continue
        </Button>
      </div>
    </div>
  )
}

// Completion Step Component
const CompletionStep: React.FC<any> = ({ data, onComplete }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Perfect! You're all set up! 🎉
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Welcome to your personalized wedding planning dashboard, {data.brideName} & {data.groomName}! 
          We've created your wedding profile and you're ready to start planning your special day.
        </p>
        <div className="bg-wedding-cream p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Your Wedding Summary:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Date:</strong> {data.weddingDate ? format(data.weddingDate, "PPP") : 'Not set'}</p>
            <p><strong>Style:</strong> {data.weddingStyle || 'Not specified'}</p>
            <p><strong>Guests:</strong> {data.guestCount || 'Not specified'}</p>
            <p><strong>Priorities:</strong> {data.priorities?.length ? data.priorities.join(', ') : 'None selected'}</p>
          </div>
        </div>
      </div>
      <Button onClick={onComplete} className="w-full bg-wedding-primary hover:bg-wedding-primary/90">
        Start Planning My Wedding
      </Button>
    </div>
  )
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    brideName: '',
    groomName: '',
    weddingDate: undefined,
    venue: '',
    budget: '',
    weddingStyle: '',
    guestCount: '',
    ceremony: '',
    reception: '',
    priorities: [],
    timeline: '',
    notes: ''
  })

  const steps = [
    {
      title: 'Welcome to Your Wedding Journey',
      description: 'Let\'s start planning your perfect day together',
      icon: Heart,
      component: WelcomeStep
    },
    {
      title: 'Wedding Basics',
      description: 'Tell us about your special day',
      icon: Heart,
      component: BasicsStep
    },
    {
      title: 'Style & Preferences',
      description: 'What\'s your wedding vision?',
      icon: Camera,
      component: StyleStep
    },
    {
      title: 'Planning Priorities',
      description: 'What matters most to you?',
      icon: CheckCircle,
      component: PrioritiesStep
    },
    {
      title: 'All Set!',
      description: 'Your wedding planning journey begins now',
      icon: CheckCircle,
      component: CompletionStep
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const handleComplete = async () => {
    try {
      // Save wedding data to database
      const wedding = await blink.db.weddings.create({
        bride_name: data.brideName,
        groom_name: data.groomName,
        wedding_date: data.weddingDate?.toISOString(),
        venue: data.venue,
        budget: parseFloat(data.budget) || 0,
        wedding_style: data.weddingStyle,
        guest_count: parseInt(data.guestCount) || 0,
        ceremony_location: data.ceremony,
        reception_location: data.reception,
        priorities: data.priorities.join(','),
        timeline: data.timeline,
        notes: data.notes,
        created_at: new Date().toISOString()
      })

      onComplete(data)
    } catch (error) {
      console.error('Error saving wedding data:', error)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream via-white to-wedding-cream flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    index <= currentStep
                      ? "bg-wedding-primary border-wedding-primary text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
              )
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-wedding-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-playfair text-gray-800">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={data}
              updateData={updateData}
              onNext={nextStep}
              onPrev={prevStep}
              onComplete={handleComplete}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OnboardingFlow