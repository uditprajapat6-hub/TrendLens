import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create account.')
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

        <h1 className="font-display text-2xl font-semibold mb-1">Create Account</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-brand-red/10 px-4 py-2 text-sm text-brand-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
        <input
  type="text"
  placeholder="Name"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full rounded-lg border px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400"
/>

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}