import Layout from "./components/layouts/Layout"
import LandingLayout from "./components/layouts/LandingLayout"
import Welcome from "./components/layouts/Welcome"
import Dashboard from './components/layouts/Dashboard'
import Challenge from './components/layouts/Challenge'
import Landing from './components/layouts/Landing'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { useState, useEffect, createContext } from "react"

import WORDS from './utils/VOCAB.json'

import { countdownIn24Hours, getWordByIndex, PLAN } from './utils'
import { saveUserData } from './utils/userDataService'
import { useAuth } from './contexts/AuthContext'
import { signOut } from './utils/authService'

export const AppContext = createContext()

function AppContent() {
  const { currentUser, userData, setUserData, loading, initError } = useAuth();
  const [selectedPage, setSelectedPage] = useState(3) // 3 is for landing page
  const [authMode, setAuthMode] = useState('landing') // 'landing', 'signin', 'signup'
  const [day, setDay] = useState(1)
  const [datetime, setDatetime] = useState(null)
  const [history, setHistory] = useState({})
  const [attempts, setAttempts] = useState(0)

  console.log('AppContent: Render', { loading, initError, currentUser: !!currentUser });

  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setDay(userData.day || 1)
      setDatetime(userData.datetime || null)
      setHistory(userData.history || {})
      setAttempts(userData.attempts || 0)
    }
  }, [userData])

  const daysWords = PLAN[day].map((idx) => {
    return getWordByIndex(WORDS, idx).word
  })

  function handleChangePage(pageIndex) {
    setSelectedPage(pageIndex)
  }

  function handleCreateAccount(name) {
    // For local storage users, we still need this
    if (!name) { return }
    localStorage.setItem('username', name)
    handleChangePage(1)
  }

  function handleCompleteDay() {
    const newDay = day + 1
    const newDatetime = Date.now()
    setDay(newDay)
    setDatetime(newDatetime)

    // Save to Supabase or localStorage
    const userId = currentUser ? currentUser.id : 'local-user'
    saveUserData(userId, 'day', {
      day: newDay,
      datetime: newDatetime
    })

    // Update local state
    setUserData(prev => ({
      ...prev,
      day: newDay,
      datetime: newDatetime
    }))

    setSelectedPage(1)
  }

  function handleIncrementAttempts() {
    // take the current attempt number, and add one and save it to storage
    const newRecord = attempts + 1
    const userId = currentUser ? currentUser.id : 'local-user'
    saveUserData(userId, 'attempts', newRecord)
    
    // Update local state
    setAttempts(newRecord)
    setUserData(prev => ({
      ...prev,
      attempts: newRecord
    }))
  }

  function handleSignOut() {
    signOut()
    setSelectedPage(3) // Go back to landing page
    setAuthMode('landing')
  }

  // Handle authentication flow
  useEffect(() => {
    console.log('AppContent: Auth effect', { loading, currentUser: !!currentUser, authMode });
    
    if (loading) return;

    if (initError) {
      console.log('AppContent: Init error, showing landing page');
      setSelectedPage(3);
      return;
    }

    if (currentUser) {
      // User is authenticated, go to dashboard
      console.log('AppContent: User authenticated, going to dashboard');
      setSelectedPage(1)
    } else if (authMode === 'signin' || authMode === 'signup') {
      // Stay on auth pages
      console.log('AppContent: On auth page');
      setSelectedPage(4) // Special page for auth
    } else {
      // No user and not on auth pages, show landing
      console.log('AppContent: No user, showing landing page');
      setSelectedPage(3)
    }
  }, [currentUser, authMode, loading, initError])

  // Handle challenge expiration
  useEffect(() => {
    if (day > 1 && datetime) {
      const diff = countdownIn24Hours(datetime)
      if (diff < 0) {
        console.log('Failed challenge')
        let newHistory = { ...history }
        const timestamp = new Date(datetime)
        const formattedTimestamp = timestamp.toString().split(' ').slice(1, 4).join(' ')
        newHistory[formattedTimestamp] = day
        setHistory(newHistory)
        setDay(1)
        setDatetime(null)
        setAttempts(0)

        // Save updated data
        const userId = currentUser ? currentUser.id : 'local-user'
        saveUserData(userId, 'attempts', 0)
        saveUserData(userId, 'history', newHistory)
        saveUserData(userId, 'day', { day: 1, datetime: null })

        // Update local state
        setUserData(prev => ({
          ...prev,
          attempts: 0,
          history: newHistory,
          day: 1,
          datetime: null
        }))
      }
    }
  }, [day, datetime, history, currentUser, setUserData])

  // Show a loading state while initializing
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#f1f5f9',
        flexDirection: 'column'
      }}>
        <p>Loading...</p>
        {initError && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid #ef4444',
            borderRadius: '0.5rem',
            maxWidth: '80%'
          }}>
            <p style={{ margin: 0, color: '#ef4444' }}>Initialization Error:</p>
            <p style={{ margin: '0.5rem 0 0 0' }}>{initError}</p>
          </div>
        )}
      </div>
    );
  }

  const handleSignInSuccess = (user) => {
    console.log('AppContent: Sign in success', user);
    setSelectedPage(1); // Redirect to dashboard
    setAuthMode('landing');
  };

  const pages = {
    0: <Layout name={currentUser?.email || ''} setName={() => {}}><Welcome handleCreateAccount={handleCreateAccount} username="hello world" name={currentUser?.email || ''} setName={() => {}} /></Layout>,
    1: <Layout name={currentUser?.email || ''} setName={() => {}}><Dashboard history={history} name={currentUser?.user_metadata?.full_name || currentUser?.email || ''} attempts={attempts} PLAN={PLAN} day={day} handleChangePage={handleChangePage} daysWords={daysWords} datetime={datetime} /></Layout>,
    2: <Layout name={currentUser?.email || ''} setName={() => {}}><Challenge day={day} daysWords={daysWords} handleChangePage={handleChangePage} handleIncrementAttempts={handleIncrementAttempts} handleCompleteDay={handleCompleteDay} PLAN={PLAN} /></Layout>,
    3: <LandingLayout><Landing /></LandingLayout>,
    4: (
      <div className="auth-page">
        {authMode === 'signin' ? (
          <SignIn 
            onSignInSuccess={handleSignInSuccess}
            switchToSignUp={() => setAuthMode('signup')}
          />
        ) : (
          <SignUp 
            onSignUpSuccess={handleSignInSuccess}
            switchToSignIn={() => setAuthMode('signin')}
          />
        )}
      </div>
    )
  }

  return (
    <AppContext.Provider value={{ setSelectedPage, setAuthMode, handleSignOut }}>
      {pages[selectedPage]}
    </AppContext.Provider>
  )
}

function App() {
  return (
    <AppContent />
  )
}

export default App