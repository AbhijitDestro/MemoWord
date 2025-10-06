import Layout from "./components/layouts/Layout"
import LandingLayout from "./components/layouts/LandingLayout"
import Welcome from "./components/layouts/Welcome"
import Dashboard from './components/layouts/Dashboard'
import Challenge from './components/layouts/Challenge'
import Landing from './components/layouts/Landing'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { useState, useEffect, createContext } from "react"
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import WORDS from './utils/VOCAB.json'

import { countdownIn24Hours, getWordByIndex, PLAN } from './utils'
import { saveUserData } from './utils/userDataService'
import { useAuth } from './contexts/AuthContext'
import { signOut } from './utils/authService'

export const AppContext = createContext()

function AppContent() {
  const { currentUser, userProfile, userData, setUserData, loading, initError } = useAuth();
  const [day, setDay] = useState(1)
  const [datetime, setDatetime] = useState(null)
  const [history, setHistory] = useState({})
  const [attempts, setAttempts] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

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
    // Map page index to routes
    const routes = ['/', '/welcome', '/dashboard', '/challenge', '/landing']
    navigate(routes[pageIndex] || '/')
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

    navigate('/dashboard')
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
    navigate('/')
  }

  // Handle authentication flow based on user state and location
  useEffect(() => {
    console.log('AppContent: Auth effect', { loading, currentUser: !!currentUser, location });
    
    if (loading) return;

    if (initError) {
      console.log('AppContent: Init error, showing landing page');
      return;
    }

    // Redirect logic based on authentication state
    if (currentUser) {
      // User is authenticated
      if (location.pathname === '/' || location.pathname === '/signin' || location.pathname === '/signup') {
        console.log('AppContent: User authenticated, redirecting to welcome page to collect name if needed');
        // Check if user has a first name, if not redirect to welcome page
        navigate('/welcome', { replace: true });
      }
    } else {
      // No user, protect routes that require authentication
      const protectedRoutes = ['/dashboard', '/challenge', '/welcome']
      if (protectedRoutes.includes(location.pathname)) {
        console.log('AppContent: No user, redirecting to landing');
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, loading, initError, location, navigate])

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
    navigate('/welcome'); // Redirect to welcome page to check if name is needed
  };

  return (
    <AppContext.Provider value={{ handleSignOut }}>
      <Routes>
        <Route path="/" element={
          <LandingLayout>
            <Landing />
          </LandingLayout>
        } />
        <Route path="/welcome" element={
          <Layout>
            <Welcome />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard 
              history={history} 
              name={userProfile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || ''} 
              attempts={attempts} 
              PLAN={PLAN} 
              day={day} 
              handleChangePage={handleChangePage} 
              daysWords={daysWords} 
              datetime={datetime} 
            />
          </Layout>
        } />
        <Route path="/challenge" element={
          <Layout>
            <Challenge 
              day={day} 
              daysWords={daysWords} 
              handleChangePage={handleChangePage} 
              handleIncrementAttempts={handleIncrementAttempts} 
              handleCompleteDay={handleCompleteDay} 
              PLAN={PLAN} 
            />
          </Layout>
        } />
        <Route path="/signin" element={
          <div className="auth-page">
            <SignIn 
              onSignInSuccess={handleSignInSuccess}
              switchToSignUp={() => navigate('/signup')}
            />
          </div>
        } />
        <Route path="/signup" element={
          <div className="auth-page">
            <SignUp 
              onSignUpSuccess={handleSignInSuccess}
              switchToSignIn={() => navigate('/signin')}
            />
          </div>
        } />
      </Routes>
    </AppContext.Provider>
  )
}

function App() {
  return (
    <AppContent />
  )
}

export default App