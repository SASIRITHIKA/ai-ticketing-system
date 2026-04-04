import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const roleInfo = {
  customer: {
    title: 'Customer',
    description: 'Submit and track your support tickets',
    icon: '👤',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  admin: {
    title: 'Administrator',
    description: 'Full system access and management',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  },
  finance_team: {
    title: 'Finance Team',
    description: 'Handle billing and payment issues',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  technical_team: {
    title: 'Technical Team',
    description: 'Resolve technical problems and bugs',
    icon: '🔧',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  },
  product_team: {
    title: 'Product Team',
    description: 'Handle feature requests and feedback',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
  general_team: {
    title: 'General Support',
    description: 'Handle general queries and account issues',
    icon: '💬',
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
  }
}

const Profile = () => {
  const { user } = useAuth()
  const info = roleInfo[user?.role] || roleInfo.customer
  const [copied, setCopied] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(user?.id || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout>
      <div className="px-8 pt-8 pb-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Your account information</p>
        </div>

        {/* Profile Card — fully visible, fixed */}
        <div className="rounded-2xl overflow-hidden mb-6"
          style={{ background: '#1e293b', border: '1px solid #334155' }}>

          {/* Banner */}
          <div className="h-24 relative" style={{ background: info.gradient }}>
            <div className="absolute inset-0 opacity-20"
              />
          </div>

          {/* Avatar + Name — overlapping banner */}
          <div className="px-8 pt-12 pb-8">
            <div className="flex items-end space-x-5 -mt-6 mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-xl"
                style={{ background: info.gradient, border: '3px solid #1e293b' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-black text-white">{user?.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-slate-400 text-sm">{info.title}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
  { label: 'Full Name', value: user?.name },
  { label: 'Email Address', value: user?.email },
  ...(user?.role !== 'customer'
    ? [
        { label: 'Role', value: info.title },
        { label: 'Department', value: info.description },
      ]
    : []),
].map((item) => (
                <div key={item.label} className="rounded-xl p-4"
                  style={{ background: '#0f172a', border: '1px solid #334155' }}>
                  <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{item.label}</p>
                  <p className="text-white text-sm font-semibold">{item.value}</p>
                </div>
              ))}

              {/* User ID */}
              <div className="rounded-xl p-4 md:col-span-2"
                style={{ background: '#0f172a', border: '1px solid #334155' }}>
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">User ID</p>
                <div className="flex items-center justify-between">
                  <span className="mono text-cyan-400 text-sm">#{user?.id?.slice(-12).toUpperCase()}</span>
                  <button onClick={copyId}
                    className="text-xs px-3 py-1 rounded-lg transition-all"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
                    {copied ? '✅ Copied!' : 'Copy ID'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile