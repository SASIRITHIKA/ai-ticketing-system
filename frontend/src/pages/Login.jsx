import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', formData)
      login(res.data.user, res.data.token)
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'customer') navigate('/dashboard')
      else navigate('/team-dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>

      {/* Left Branding Panel — minimal */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: '#0c1628', borderRight: '1px solid #1e293b' }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #06b6d4 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              ZD
            </div>
            <span className="text-white font-bold text-lg">ZohoDesk AI</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 text-xs font-medium">AI-Powered Support System</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Welcome to<br />
            <span style={{ background: 'linear-gradient(135deg, #06b6d4, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ZohoDesk
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Your AI-powered customer support solution that automatically classifies, prioritizes, and routes tickets to the right team.
          </p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center space-x-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>ZD</div>
            <span className="text-white font-bold">ZohoDesk AI</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Sign in</h2>
          <p className="text-slate-400 mb-8">Enter your credentials to access the platform</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                style={{ background: '#1e293b', border: '1px solid #334155' }}
                placeholder="you@example.com" />
            </div>
<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>

  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      placeholder="••••••••"
      className="w-full rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
      style={{ background: '#1e293b', border: '1px solid #334155' }}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
    >
      {showPassword ? (
        // Eye OFF
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a17.39 17.39 0 012.39-3.568M6.223 6.223A9.956 9.956 0 0112 5c5 0 9 4 10 7a17.37 17.37 0 01-4.293 5.293M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3" />
        </svg>
      ) : (
        // Eye ON
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  </div>
</div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New customer?{' '}
            <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login