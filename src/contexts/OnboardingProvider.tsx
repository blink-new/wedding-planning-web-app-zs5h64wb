import React, { useState, useEffect } from 'react'
import { OnboardingContext } from './onboarding-context'
import { blink } from '@/blink/client'

interface OnboardingProviderProps {
  children: React.ReactNode
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkOnboardingStatus = async () => {
    try {
      // Check if user has completed onboarding by looking for existing weddings
      const weddings = await blink.db.weddings.list({ limit: 1 })
      setIsOnboardingComplete(weddings.length > 0)
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      setIsOnboardingComplete(false)
    } finally {
      setIsLoading(false)
    }
  }

  const setOnboardingComplete = (complete: boolean) => {
    setIsOnboardingComplete(complete)
    // Store in localStorage as backup
    localStorage.setItem('wedding-onboarding-complete', complete.toString())
  }

  useEffect(() => {
    // Check localStorage first for immediate feedback
    const stored = localStorage.getItem('wedding-onboarding-complete')
    if (stored === 'true') {
      setIsOnboardingComplete(true)
    }
    
    // Then check database for authoritative status
    checkOnboardingStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-cream via-white to-wedding-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-wedding-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your wedding planning experience...</p>
        </div>
      </div>
    )
  }

  return (
    <OnboardingContext.Provider value={{
      isOnboardingComplete,
      setOnboardingComplete,
      checkOnboardingStatus
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}