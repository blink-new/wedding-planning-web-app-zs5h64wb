import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { GuestManagement } from './pages/GuestManagement'
import { RSVPManagement } from './pages/RSVPManagement'
import { Groups } from './pages/Groups'
import { Messages } from './pages/Messages'
import { WeddingDetails } from './pages/WeddingDetails'
import { GuestPortal } from './pages/GuestPortal'
import { Vendors } from './pages/Vendors'
import { Timeline } from './pages/Timeline'
import { LoadingScreen } from './components/ui/LoadingScreen'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import { OnboardingProvider } from './contexts/OnboardingProvider'
import { useOnboarding } from './hooks/useOnboarding'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isOnboardingComplete, setOnboardingComplete } = useOnboarding()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true)
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-primary/10 to-wedding-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Wedding Planning App
          </h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-wedding-primary hover:bg-wedding-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Show onboarding flow if not completed
  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:pl-64">
          <Header 
            user={user} 
            onMenuClick={() => setSidebarOpen(true)}
          />
          
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/guests" element={<GuestManagement />} />
                <Route path="/rsvp" element={<RSVPManagement />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/wedding-details" element={<WeddingDetails />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/guest-portal/:weddingId?" element={<GuestPortal />} />
              </Routes>
            </div>
          </main>
        </div>
        
        <Toaster />
      </div>
    </Router>
  )
}

function App() {
  return (
    <OnboardingProvider>
      <AppContent />
    </OnboardingProvider>
  )
}

export default App