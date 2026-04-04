import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TicketDetailModal from '../components/TicketDetailModal'
import API from '../api/axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const priorityColors = {
  Low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  Critical: 'bg-red-500/20 text-red-400 border border-red-500/30'
}

const statusColors = {
  Open: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Resolved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Closed: 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
}

const AddTeamMemberForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'technical_team' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    setLoading(true)
    try {
      await API.post('/admin/users', form)
      setMsg({ type: 'success', text: '✅ Team member created successfully!' })
      setForm({ name: '', email: '', password: '', role: 'technical_team' })
      onSuccess()
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create member' })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {msg.text && (
        <div className={`text-sm px-4 py-2 rounded-xl mb-4 ${
          msg.type === 'success'
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            : 'text-red-400 bg-red-500/10 border border-red-500/20'
        }`}>{msg.text}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { name: 'name', placeholder: 'Full Name', type: 'text' },
          { name: 'email', placeholder: 'Email Address', type: 'email' },
          { name: 'password', placeholder: 'Password', type: 'password' },
        ].map((f) => (
          <input key={f.name} type={f.type} placeholder={f.placeholder} required
            value={form[f.name]}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            className="rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            style={{ background: '#0f172a', border: '1px solid #334155' }} />
        ))}
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          style={{ background: '#0f172a', border: '1px solid #334155' }}>
          <option value="technical_team">Technical Team</option>
          <option value="finance_team">Finance Team</option>
          <option value="product_team">Product Team</option>
          <option value="general_team">General Team</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="px-6 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
        {loading ? 'Creating...' : '+ Add Team Member'}
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
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [editTicket, setEditTicket] = useState(null)
  const [editData, setEditData] = useState({})
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setError('')
    try {
      const [t, u, s] = await Promise.all([
        API.get('/admin/tickets'),
        API.get('/admin/users'),
        API.get('/admin/stats')
      ])
      setTickets(Array.isArray(t.data) ? t.data : [])
      setUsers(Array.isArray(u.data) ? u.data : [])
      setStats(s.data)
    } catch (err) {
      setError('Failed to load data. Make sure you are logged in as admin.')
      console.error(err)
    }
    setLoading(false)
  }

  const handleUpdateTicket = async (id) => {
    try {
      await API.put(`/admin/tickets/${id}`, editData)
      await fetchAll()
      setEditTicket(null)
      setEditData({})
    } catch (err) { alert('Failed to update ticket') }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await API.delete(`/admin/users/${id}`); await fetchAll() }
    catch (err) { alert('Failed to delete user') }
  }

  const filtered = tickets.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false
    if (filterTeam !== 'All' && t.assignedTeam !== filterTeam) return false
    return true
  })

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Full system overview and management</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'tickets', label: `🎫 All Tickets (${tickets.length})` },
            { key: 'users', label: `👥 Team Members (${users.length})` }
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              style={activeTab === tab.key
                ? { background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }
                : { background: '#1e293b', border: '1px solid #334155' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && stats && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Tickets', value: stats.totalTickets ?? 0, color: 'text-cyan-400', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
                { label: 'Open', value: stats.openTickets ?? 0, color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
                { label: 'Resolved', value: stats.resolvedTickets ?? 0, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
                { label: 'Critical', value: stats.criticalTickets ?? 0, color: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
                { label: 'Customers', value: stats.totalUsers ?? 0, color: 'text-purple-400', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' }
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5"
                  style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Row 1: Category Bar + Priority Pie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <h3 className="font-bold text-white mb-1">📁 Tickets by Category</h3>
                <p className="text-slate-500 text-xs mb-5">Distribution across support categories</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.categoryBreakdown.map(i => ({
                    name: i._id?.replace(' Issue', '').replace(' Problem', '').replace(' Request', '').replace(' Query', '').replace(' Management', ''),
                    value: i.count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                      cursor={{ fill: 'rgba(6,182,212,0.05)' }} />
                    <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <h3 className="font-bold text-white mb-1">🔥 Tickets by Priority</h3>
                <p className="text-slate-500 text-xs mb-5">Urgency breakdown of all tickets</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={stats.priorityBreakdown.map(i => ({ name: i._id, value: i.count }))}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {stats.priorityBreakdown.map((entry) => {
                        const colors = { Low: '#10b981', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' }
                        return <Cell key={entry._id} fill={colors[entry._id] || '#06b6d4'} />
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Team Bar + Status Pie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <h3 className="font-bold text-white mb-1">👥 Tickets by Team</h3>
                <p className="text-slate-500 text-xs mb-5">Workload distribution per team</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.teamBreakdown.map(i => ({
                    name: i._id?.replace('_team', '').replace('_', ' '),
                    value: i.count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                      cursor={{ fill: 'rgba(6,182,212,0.05)' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <h3 className="font-bold text-white mb-1">📊 Tickets by Status</h3>
                <p className="text-slate-500 text-xs mb-5">Current resolution progress</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Open', value: stats.openTickets ?? 0 },
                        { name: 'Resolved', value: stats.resolvedTickets ?? 0 },
                        { name: 'In Progress', value: Math.max(0, (stats.totalTickets - stats.openTickets - stats.resolvedTickets)) },
                      ].filter(i => i.value > 0)}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }} />
                    <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Progress Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '📁 Category Breakdown', data: stats.categoryBreakdown || [], color: '#06b6d4' },
                { title: '🔥 Priority Breakdown', data: stats.priorityBreakdown || [], color: '#f59e0b' },
                { title: '👥 Team Breakdown', data: stats.teamBreakdown || [], color: '#8b5cf6' }
              ].map((section) => (
                <div key={section.title} className="rounded-2xl p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  <h3 className="font-bold text-white mb-4">{section.title}</h3>
                  {section.data.length === 0 ? (
                    <p className="text-slate-500 text-sm">No data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {section.data.map((item) => {
                        const total = section.data.reduce((a, b) => a + b.count, 0)
                        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                        return (
                          <div key={item._id}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-slate-400 text-xs">{item._id?.replace('_', ' ')}</span>
                              <span className="text-white text-xs font-bold">{item.count} <span className="text-slate-500">({pct}%)</span></span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-700">
                              <div className="h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, background: section.color }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALL TICKETS ── */}
        {activeTab === 'tickets' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <option value="All">All Status</option>
                <option>Open</option><option>In Progress</option>
                <option>Resolved</option><option>Closed</option>
              </select>
              <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}
                className="rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <option value="All">All Teams</option>
                <option value="finance_team">Finance</option>
                <option value="technical_team">Technical</option>
                <option value="product_team">Product</option>
                <option value="general_team">General</option>
              </select>
              <span className="text-slate-500 text-sm self-center">{filtered.length} tickets</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <p className="text-slate-500">No tickets found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((ticket) => (
                  <div key={ticket._id} className="rounded-2xl p-5"
                    style={{ background: '#1e293b', border: '1px solid #334155' }}>
                    <div className="flex items-start justify-between mb-3 cursor-pointer group"
                      onClick={() => setSelectedTicket(ticket)}>
                      <div className="flex-1 mr-4">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="mono text-xs text-slate-500">#{ticket._id?.slice(-8).toUpperCase()}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                        </div>
                        <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{ticket.title}</h3>
                        <p className="text-slate-500 text-xs mt-1">
                          {ticket.customer?.name || 'Unknown'} · {ticket.assignedTeam?.replace('_', ' ')} · {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-slate-500 text-xs flex-shrink-0">Click to view →</span>
                    </div>

                    {editTicket === ticket._id ? (
                      <div className="rounded-xl p-4 mt-2" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Override AI Classification</p>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          {[
                            { key: 'category', options: ['Billing Issue', 'Technical Problem', 'Account Management', 'Feature Request', 'General Query'], default: ticket.category },
                            { key: 'priority', options: ['Low', 'Medium', 'High', 'Critical'], default: ticket.priority },
                            { key: 'status', options: ['Open', 'In Progress', 'Resolved', 'Closed'], default: ticket.status }
                          ].map((sel) => (
                            <select key={sel.key} defaultValue={sel.default}
                              onChange={(e) => setEditData({ ...editData, [sel.key]: e.target.value })}
                              className="rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                              style={{ background: '#1e293b', border: '1px solid #334155' }}>
                              {sel.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleUpdateTicket(ticket._id)}
                            className="flex-1 py-2 rounded-xl text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>Save</button>
                          <button onClick={() => { setEditTicket(null); setEditData({}) }}
                            className="flex-1 py-2 rounded-xl text-slate-300 text-sm font-bold"
                            style={{ background: '#334155' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { setEditTicket(ticket._id); setEditData({}) }}
                        className="mt-2 px-4 py-1.5 rounded-xl text-purple-400 text-sm font-medium transition-all"
                        style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                        ✏️ Override Classification
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TEAM MEMBERS ── */}
        {activeTab === 'users' && (
          <div>
            <div className="rounded-2xl p-6 mb-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <h3 className="text-white font-bold mb-5">➕ Add New Team Member</h3>
              <AddTeamMemberForm onSuccess={fetchAll} />
            </div>

            {users.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <p className="text-slate-500">No users found</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <table className="w-full">
                  <thead style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                    <tr>
                      {['Name', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white text-sm font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {u.role !== 'admin' ? (
                            <button onClick={() => handleDeleteUser(u._id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
                          ) : (
                            <span className="text-slate-600 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </Layout>
  )
}

export default AdminDashboard