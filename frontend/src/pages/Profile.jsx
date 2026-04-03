import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const roleInfo = {
  customer: {
    title: 'Customer Account',
    description: 'Submit and track your support tickets',
    icon: '👤',
    color: 'from-emerald-500 to-teal-600',
    permissions: ['Submit support tickets', 'View ticket status', 'Receive team responses', 'Track resolution progress']
  },
  admin: {
    title: 'System Administrator',
    description: 'Full system access and management',
    icon: '⚙️',
    color: 'from-purple-500 to-indigo-600',
    permissions: ['View all tickets', 'Override AI classification', 'Create team accounts', 'Delete users', 'View analytics', 'Manage system settings']
  },
  finance_team: {
    title: 'Finance Team Agent',
    description: 'Handle billing and payment issues',
    icon: '💰',
    color: 'from-yellow-500 to-orange-500',
    permissions: ['View billing tickets', 'Resolve payment issues', 'Add resolution remarks', 'Update ticket status']
  },
  technical_team: {
    title: 'Technical Team Agent',
    description: 'Resolve technical problems and bugs',
    icon: '🔧',
    color: 'from-cyan-500 to-blue-600',
    permissions: ['View technical tickets', 'Resolve software issues', 'Add resolution remarks', 'Update ticket status']
  },
  product_team: {
    title: 'Product Team Agent',
    description: 'Handle feature requests and feedback',
    icon: '🚀',
    color: 'from-pink-500 to-rose-600',
    permissions: ['View feature requests', 'Provide product feedback', 'Add resolution remarks', 'Update ticket status']
  },
  general_team: {
    title: 'General Support Agent',
    description: 'Handle general queries and account issues',
    icon: '💬',
    color: 'from-slate-500 to-slate-600',
    permissions: ['View general tickets', 'Handle account queries', 'Add resolution remarks', 'Update ticket status']
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
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Your account details and permissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <div className={`h-24 bg-gradient-to-br ${info.color} relative`}>
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              </div>
              <div className="px-6 pb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl -mt-8 mb-4 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-white font-bold text-lg">{user?.name}</h2>
                <p className="text-slate-400 text-sm">{user?.email}</p>
                <div className="mt-3 inline-flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-cyan-400 text-xs font-medium">{info.title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            {/* Account Info */}
            <div className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <h3 className="text-white font-bold mb-4">Account Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email Address', value: user?.email },
                  { label: 'Role', value: info.title },
                  { label: 'Department', value: info.description },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">User ID</span>
                  <button onClick={copyId}
                    className="mono text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded hover:bg-cyan-500/20 transition-all">
                    {copied ? '✅ Copied!' : `#${user?.id?.slice(-8).toUpperCase()}`}
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <h3 className="text-white font-bold mb-4">Access Permissions</h3>
              <div className="grid grid-cols-1 gap-2">
                {info.permissions.map((perm) => (
                  <div key={perm} className="flex items-center space-x-3 py-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 text-xs">✓</span>
                    </div>
                    <span className="text-slate-300 text-sm">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile