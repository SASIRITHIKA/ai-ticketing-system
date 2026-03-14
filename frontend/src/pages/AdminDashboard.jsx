import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import API from '../api/axios'

const priorityColors = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700'
}

const statusColors = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-100 text-gray-700'
}

const AddTeamMemberForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'technical_team'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await API.post('/admin/users', formData)
      setSuccess('Team member created successfully!')
      setFormData({ name: '', email: '', password: '', role: 'technical_team' })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team member')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Full Name"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email Address"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Password"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="technical_team">Technical Team</option>
          <option value="finance_team">Finance Team</option>
          <option value="product_team">Product Team</option>
          <option value="general_team">General Team</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg text-sm transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Team Member'}
      </button>
    </form>
  )
}

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterTeam, setFilterTeam] = useState('All')
  const [editTicket, setEditTicket] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [ticketsRes, usersRes, statsRes] = await Promise.all([
        API.get('/admin/tickets'),
        API.get('/admin/users'),
        API.get('/admin/stats')
      ])
      setTickets(ticketsRes.data)
      setUsers(usersRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error('Failed to load data')
    }
    setLoading(false)
  }

  const handleUpdateTicket = async (ticketId) => {
    try {
      await API.put(`/admin/tickets/${ticketId}`, editData)
      await fetchAll()
      setEditTicket(null)
      setEditData({})
    } catch (err) {
      alert('Failed to update ticket')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await API.delete(`/admin/users/${userId}`)
      await fetchAll()
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const filteredTickets = tickets.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false
    if (filterTeam !== 'All' && t.assignedTeam !== filterTeam) return false
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Full system overview and management</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          {['overview', 'tickets', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div>
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Tickets', value: stats.totalTickets, color: 'text-blue-600' },
                { label: 'Open', value: stats.openTickets, color: 'text-yellow-600' },
                { label: 'Resolved', value: stats.resolvedTickets, color: 'text-green-600' },
                { label: 'Critical', value: stats.criticalTickets, color: 'text-red-600' },
                { label: 'Customers', value: stats.totalUsers, color: 'text-purple-600' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">📁 By Category</h3>
                <div className="space-y-3">
                  {stats.categoryBreakdown.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item._id}</span>
                      <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">🔥 By Priority</h3>
                <div className="space-y-3">
                  {stats.priorityBreakdown.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item._id}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityColors[item._id]}`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Breakdown */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">👥 By Team</h3>
                <div className="space-y-3">
                  {stats.teamBreakdown.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {item._id.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Teams</option>
                <option value="finance_team">Finance Team</option>
                <option value="technical_team">Technical Team</option>
                <option value="product_team">Product Team</option>
                <option value="general_team">General Team</option>
              </select>

              <span className="text-sm text-gray-500 self-center ml-2">
                {filteredTickets.length} tickets
              </span>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        From: {ticket.customer?.name} ({ticket.customer?.email})
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 mb-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">🤖 AI Summary</p>
                    <p className="text-sm text-blue-800">{ticket.aiSummary}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>📁 {ticket.category}</span>
                    <span>👥 {ticket.assignedTeam.replace('_', ' ')}</span>
                    <span>🕐 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>

                  {ticket.remarks && (
                    <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 mb-3">
                      <p className="text-xs font-semibold text-green-600 mb-1">✅ Remarks</p>
                      <p className="text-sm text-green-800">{ticket.remarks}</p>
                    </div>
                  )}

                  {/* Admin Edit Panel */}
                  {editTicket === ticket._id ? (
                    <div className="border border-gray-200 rounded-lg p-4 mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-3">Override AI Classification</p>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <select
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          defaultValue={ticket.category}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Billing Issue</option>
                          <option>Technical Problem</option>
                          <option>Account Management</option>
                          <option>Feature Request</option>
                          <option>General Query</option>
                        </select>
                        <select
                          onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                          defaultValue={ticket.priority}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                        <select
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          defaultValue={ticket.status}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                          <option>Closed</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateTicket(ticket._id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition duration-200"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => { setEditTicket(null); setEditData({}) }}
                          className="flex-1 border border-gray-300 text-gray-600 font-medium py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditTicket(ticket._id)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium px-4 py-2 rounded-lg text-sm transition duration-200"
                    >
                      ✏️ Override Classification
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
{activeTab === 'users' && (
  <div>
    {/* Add Team Member Form */}
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">➕ Add Team Member</h3>
      <AddTeamMemberForm onSuccess={fetchAll} />
    </div>

    {/* Users Table */}
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Joined</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {user.role.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
      </div>
    </div>
  )
}

export default AdminDashboard