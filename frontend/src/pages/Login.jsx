import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not log in. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] grid place-items-center px-6 py-16">
      <div className="w-full max-w-sm glass-panel p-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold mb-8">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-blue text-white">
            <FiTrendingUp size={18} />
          </span>
          Trendlens
        </Link>

        <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Log in to pick up your saved reports and streak.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-brand-red/10 px-4 py-2 text-sm text-brand-red">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New here? <Link to="/register" className="text-brand-blue font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
