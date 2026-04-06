import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
const validateForm = () => {
  const { email, password } = formData

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Allowed domains (optional)
  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com']

  const domain = email.split('@')[1]

  if (!emailRegex.test(email)) {
    return 'Enter a valid email format'
  }

  if (!allowedDomains.includes(domain)) {
    return 'Use a valid email provider (gmail, yahoo, outlook)'
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/

  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters, include 1 uppercase and 1 special symbol'
  }

  return null
}
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  const validationError = validateForm()
  if (validationError) {
    setError(validationError)
    return
  }

  setLoading(true)
  try {
    await API.post('/auth/register', { ...formData, role: 'admin' })
    navigate('/login')
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed')
  }
  setLoading(false)
}

const handleGoogleRegister = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential)
    const res = await API.post('/auth/google', {
      token: credentialResponse.credential,
      name: decoded.name,
      email: decoded.email
    })
    navigate('/login')
  } catch (err) {
    setError('Google signup failed. Please try again.')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0f172a' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>ZD</div>
          <span className="text-white font-bold">ZohoDesk AI</span>
        </div>

        <h2 className="text-3xl font-black text-white mb-2">Create account</h2>
        
        

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
].map((field) => (
  <div key={field.name}>
    <label className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
    <input
      type={field.type}
      name={field.name}
      value={formData[field.name]}
      onChange={handleChange}
      required
      placeholder={field.placeholder}
      className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
      style={{ background: '#1e293b', border: '1px solid #334155' }}
    />
  </div>
))}

{/* Password Field (separate) */}
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
  // Eye OFF (hidden)
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a17.39 17.39 0 012.39-3.568M6.223 6.223A9.956 9.956 0 0112 5c5 0 9 4 10 7a17.37 17.37 0 01-4.293 5.293M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3" />
  </svg>
) : (
  // Eye ON (visible)
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
  className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50 transition-all"
  style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
  {loading ? 'Creating account...' : 'Create Account →'}
</button>

{/* Divider */}
<div className="flex items-center space-x-3 my-2">
  <div className="flex-1 h-px bg-slate-700" />
  <span className="text-slate-500 text-xs">or</span>
  <div className="flex-1 h-px bg-slate-700" />
</div>

{/* Google Signup */}
<div className="flex justify-center">
  <GoogleLogin
    onSuccess={handleGoogleRegister}
    onError={() => setError('Google signup failed')}
    theme="filled_black"
    shape="rectangular"
    width="400"
    text="signup_with"
  />
</div>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register