import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { blink } from './blink/client'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'

// Pages
import { Dashboard } from './pages/Dashboard'
import { Messages } from './pages/Messages'
import { Guests } from './pages/Guests'
import { Groups } from './pages/Groups'
import { Templates } from './pages/Templates'
import { Analytics } from './pages/Analytics'
import { EventStream } from './pages/EventStream'
import { Settings } from './pages/Settings'

interface User {
  id: string
  email: string
  displayName?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setAuthState({
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated
      })
    })

    return unsubscribe
  }, [])

  if (authState.isLoading) {
    return <LoadingScreen />
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Texting</h1>
            <p className="text-gray-600">Keep your guests informed with scheduled texts & instant broadcasts</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Pre-scheduled messages
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              On-the-fly broadcasts
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Organize guests into groups
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Collect replies from guests
            </div>
          </div>

          <button
            onClick={() => blink.auth.login()}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Get Started
          </button>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={authState.user} />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/stream" element={<EventStream />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App