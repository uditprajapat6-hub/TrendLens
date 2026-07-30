import { useState } from 'react'
import { FiMenu, FiX, FiTrendingUp } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'



export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-blue text-white">
            <FiTrendingUp size={18} />
          </span>
          Trendlens
        </Link>

    

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              
              <button
                onClick={() => { logout(); navigate('/') }}
                className="btn-primary !px-5 !py-2 text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-5 !py-2 text-sm">Log in</Link>
              <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">Get started</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-slate-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden flex flex-col gap-4 border-t border-slate-200 dark:border-slate-800 px-6 py-6">
       
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={() => { logout(); navigate('/'); setOpen(false) }} className="btn-primary flex-1 !py-2 text-sm">
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary flex-1 !py-2 text-sm" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-primary flex-1 !py-2 text-sm" onClick={() => setOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
