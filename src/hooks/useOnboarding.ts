import { useContext } from 'react'
import { OnboardingContext } from '@/contexts/onboarding-context'

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}