import { useContext } from 'react'
import { AppContext } from '../../App.jsx'

export default function Layout(props) {
  const { children, name } = props
  const { setSelectedPage, handleSignOut } = useContext(AppContext)

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
                onClick={() => setSelectedPage(name ? 1 : 3)} 
                style={{ cursor: 'pointer', margin: 0 }}
              >
                MemoWord
              </h1>
              {name && (
                <button className="card-button-secondary" onClick={handleSignOut}>
                  Sign Out
                </button>
              )}
              {!name && <div></div>} {/* Spacer for proper flex alignment when no sign out button */}
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