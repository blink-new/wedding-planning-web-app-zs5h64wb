import { Heart } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-primary/10 to-wedding-primary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Heart className="w-16 h-16 text-wedding-primary mx-auto animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-wedding-primary/20 border-t-wedding-primary rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="mt-6 text-2xl font-serif font-semibold text-gray-900">
          Loading your wedding plans...
        </h2>
        <p className="mt-2 text-gray-600">
          Just a moment while we prepare everything for you
        </p>
      </div>
    </div>
  )
}