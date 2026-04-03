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

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c1628 0%, #0f172a 50%, #0a1929 100%)' }}>

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
          <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0891b2, transparent)' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            ZD
          </div>
          <span className="text-white font-bold text-lg">ZohoDesk AI</span>
        </div>

        {/* Main Content */}
        <div className="relative">
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
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Your AI-powered customer support solution that automatically classifies, prioritizes, and routes tickets to the right team.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            {['🤖 AI Classification', '⚡ Auto Routing', '📊 Analytics', '🔒 Secure'].map((f) => (
              <span key={f} className="text-sm text-slate-300 bg-slate-800/60 border border-slate-700 px-4 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '5', label: 'Categories' },
            { value: '4', label: 'Priority Levels' },
            { value: '< 2s', label: 'AI Response' }
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <p className="text-2xl font-black text-cyan-400">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex items-center space-x-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              ZD
            </div>
            <span className="text-white font-bold">ZohoDesk AI</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-2">Sign in</h2>
          <p className="text-slate-400 mb-8">Enter your credentials to access the platform</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                style={{ background: '#1e293b', border: '1px solid #334155' }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} required
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                style={{ background: '#1e293b', border: '1px solid #334155' }}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 disabled:opacity-50"
              style={{ background: loading ? '#0891b2' : 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
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