import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Heart, MapPin, Upload, CheckCircle, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { blink } from '@/blink/client'

interface OnboardingData {
  brideName: string
  groomName: string
  weddingDate: Date | undefined
  venue: string
  guestListFile: File | null
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
            <FileSpreadsheet className="w-8 h-8 text-wedding-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">Guest Management</p>
          </div>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-wedding-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">Venue Planning</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-wedding-primary mx-auto mb-2" />
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
        <Label htmlFor="venue">Wedding Location *</Label>
        <Input
          id="venue"
          value={data.venue}
          onChange={(e) => updateData({ venue: e.target.value })}
          placeholder="Wedding venue or location"
          className="border-gray-300 focus:border-wedding-primary"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex-1 bg-wedding-primary hover:bg-wedding-primary/90"
          disabled={!data.brideName || !data.groomName || !data.weddingDate || !data.venue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

// Guest List Upload Step Component
const GuestListStep: React.FC<any> = ({ data, updateData, onNext, onPrev }) => {
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState('')

  const handleFileChange = (file: File | null) => {
    setFileError('')
    
    if (file) {
      // Check file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]
      
      if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        setFileError('Please upload an Excel file (.xlsx, .xls) or CSV file')
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB')
        return
      }
      
      updateData({ guestListFile: file })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleNext = () => {
    if (data.guestListFile) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Required Excel/CSV Format:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Name</strong> (required) - Full name of guest</li>
                <li>• <strong>Phone</strong> (required) - Cell phone number for RSVP</li>
                <li>• <strong>Email</strong> (optional) - Email address</li>
                <li>• <strong>Group</strong> (optional) - Family, Friends, Work, etc.</li>
                <li>• <strong>Plus One</strong> (optional) - Yes/No or True/False</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Upload Guest List *</Label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-wedding-primary bg-wedding-primary/5" : "border-gray-300",
              data.guestListFile ? "border-green-500 bg-green-50" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {data.guestListFile ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <p className="text-green-800 font-semibold">{data.guestListFile.name}</p>
                <p className="text-sm text-green-600">
                  {(data.guestListFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateData({ guestListFile: null })}
                  className="mt-2"
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Drop your Excel file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse files
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="border-wedding-primary text-wedding-primary hover:bg-wedding-primary/10"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
          {fileError && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {fileError}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex-1 bg-wedding-primary hover:bg-wedding-primary/90"
          disabled={!data.guestListFile}
        >
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
            <p><strong>Location:</strong> {data.venue || 'Not specified'}</p>
            <p><strong>Guest List:</strong> {data.guestListFile ? `${data.guestListFile.name} uploaded` : 'Not uploaded'}</p>
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
    guestListFile: null
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
      title: 'Guest List Upload',
      description: 'Upload your guest list with phone numbers',
      icon: FileSpreadsheet,
      component: GuestListStep
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
        created_at: new Date().toISOString()
      })

      // TODO: Process guest list file and save guests to database
      // This would involve parsing the Excel/CSV file and creating guest records

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