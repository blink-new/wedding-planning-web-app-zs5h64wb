import { createContext } from 'react'

export interface OnboardingContextType {
  isOnboardingComplete: boolean
  setOnboardingComplete: (complete: boolean) => void
  checkOnboardingStatus: () => Promise<void>
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)