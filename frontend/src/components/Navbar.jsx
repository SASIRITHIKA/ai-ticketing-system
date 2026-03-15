import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleLabels = {
  customer: 'Customer',
  admin: 'Admin',
  finance_team: 'Finance Team',
  technical_team: 'Technical Team',
  product_team: 'Product Team',
  general_team: 'General Team'
}

const roleBadgeColors = {
  customer: 'bg-green-100 text-green-700',
  admin: 'bg-purple-100 text-purple-700',
  finance_team: 'bg-yellow-100 text-yellow-700',
  technical_team: 'bg-blue-100 text-blue-700',
  product_team: 'bg-pink-100 text-pink-700',
  general_team: 'bg-gray-100 text-gray-700'
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-lg">
            
          </div>
          <span className="text-xl font-bold text-gray-800">ZohoDesk AI</span>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg text-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar