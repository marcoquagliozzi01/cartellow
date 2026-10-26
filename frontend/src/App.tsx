import { useState } from 'react'
import CatalogConfigurationPage from './pages/CatalogConfigurationPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import './App.css'

type Page = 'home' | 'catalog'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [userEmail, setUserEmail] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)

  if (!isSignedIn) {
    return (
      <LoginPage
        onLogin={(email) => {
          setUserEmail(email)
          setIsSignedIn(true)
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => setPage('home')}>
          <span className="brand-mark" aria-hidden="true">c</span>
          <span>cartellow<span className="brand-dot">.</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          <button
            className={`nav-link ${page === 'home' ? 'active' : ''}`}
            onClick={() => setPage('home')}
          >
            <span className="nav-icon" aria-hidden="true">⌂</span>
            Overview
          </button>
          <button
            className={`nav-link ${page === 'catalog' ? 'active' : ''}`}
            onClick={() => setPage('catalog')}
          >
            <span className="nav-icon" aria-hidden="true">▦</span>
            Catalog settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon" aria-hidden="true">?</span>
            <div>
              <strong>Need a hand?</strong>
              <span>We’re here to help.</span>
            </div>
            <span className="help-arrow" aria-hidden="true">↗</span>
          </div>
          <button className="profile-button" onClick={() => setIsSignedIn(false)}>
            <span className="avatar">{userEmail.charAt(0).toUpperCase() || 'M'}</span>
            <span className="profile-details">
              <strong>{userEmail || 'My workspace'}</strong>
              <span>Administrator</span>
            </span>
            <span className="profile-menu" aria-hidden="true">···</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {page === 'home' ? (
          <HomePage onOpenCatalog={() => setPage('catalog')} />
        ) : (
          <CatalogConfigurationPage />
        )}
      </main>
    </div>
  )
}

export default App
