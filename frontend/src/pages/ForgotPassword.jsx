import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import api from '../services/api'
import { parseApiError } from '../utils/errors'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setSubmitting(true)

    try {
      await api.post('/auth/reset-password', {
        email,
        newPassword,
      })
      setSuccess('Password reset successfully! Redirecting to login…')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(parseApiError(err, 'Could not reset password. Please try again.'))
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

        <h1 className="font-display text-2xl font-semibold mb-1">Reset password</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Enter your registered email and choose a new password.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-brand-red/10 px-4 py-2 text-sm text-brand-red">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
            <FiCheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-brand-blue"
              placeholder="Repeat your new password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !!success}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting ? 'Resetting password…' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="text-brand-blue font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
