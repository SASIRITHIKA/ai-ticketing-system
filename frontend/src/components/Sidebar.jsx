import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleNavItems = {
  customer: [
    { label: 'My Tickets', path: '/dashboard', icon: '🎫' },
    { label: 'Submit Ticket', path: '/submit-ticket', icon: '➕' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
  admin: [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'All Tickets', path: '/admin/tickets', icon: '🎫' },
    { label: 'Team Members', path: '/admin/users', icon: '👥' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
  finance_team: [
    { label: 'My Tickets', path: '/team-dashboard', icon: '🎫' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
  technical_team: [
    { label: 'My Tickets', path: '/team-dashboard', icon: '🎫' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
  product_team: [
    { label: 'My Tickets', path: '/team-dashboard', icon: '🎫' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
  general_team: [
    { label: 'My Tickets', path: '/team-dashboard', icon: '🎫' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
}

const roleLabels = {
  customer: 'Customer',
  admin: 'Administrator',
  finance_team: 'Finance Team',
  technical_team: 'Technical Team',
  product_team: 'Product Team',
  general_team: 'General Team'
}

const roleBadgeColors = {
  customer: 'bg-emerald-500/20 text-emerald-400',
  admin: 'bg-purple-500/20 text-purple-400',
  finance_team: 'bg-yellow-500/20 text-yellow-400',
  technical_team: 'bg-cyan-500/20 text-cyan-400',
  product_team: 'bg-pink-500/20 text-pink-400',
  general_team: 'bg-slate-500/20 text-slate-400'
}

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = roleNavItems[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0c1628 100%)', borderRight: '1px solid #1e293b' }}>

      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            ZD
          </div>
          <div>
            <p className="text-white font-bold text-sm">ZohoDesk</p>
            <p className="text-cyan-400 text-xs font-medium">AI Support</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 mx-3 mt-4 rounded-xl" style={{ background: '#1e293b' }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColors[user?.role]}`}>
              {roleLabels[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(8,145,178,0.1))',
              borderLeft: '3px solid #06b6d4',
              color: '#06b6d4'
            } : {}}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar