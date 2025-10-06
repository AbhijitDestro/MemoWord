import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../App.jsx'
import { useAuth } from '../../contexts/AuthContext'

export default function Layout(props) {
  const { children } = props
  const { handleSignOut } = useContext(AppContext)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // Get user's first name or email for display
  const displayName = currentUser?.user_metadata?.full_name || 
                     currentUser?.email || 
                     ''

  return (
      <>
          <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '2rem' // Increased margin-top to bring header lower
          }}>
              <h1 
                className="text-gradient" 
                onClick={() => {
                  // Navigate based on authentication status
                  if (currentUser) {
                    navigate('/dashboard')
                  } else {
                    navigate('/')
                  }
                }} 
                style={{ cursor: 'pointer', margin: 0 }}
              >
                MemoWord
              </h1>
              {currentUser && (
                <button className="card-button-secondary" onClick={handleSignOut}>
                  Sign Out
                </button>
              )}
              {!currentUser && <div></div>} {/* Spacer for proper flex alignment when no sign out button */}
          </header>
          <main>
              {children}
          </main>
          <footer>
              <small>Created by</small>
              <a target="_blank" href="https://github.com/AbhijitDestro">
                  <img alt="pfp" src="https://avatars.githubusercontent.com/u/134042042?v=4" />
                  <p>@AbhijitDestro</p>
                  <i className="fa-brands fa-github"></i>
              </a>
          </footer>
      </>
  )
}