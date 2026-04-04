import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import TicketDetailModal from '../components/TicketDetailModal'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

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

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets/my')
      setTickets(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleDelete = async (ticketId) => {
  if (!window.confirm('Are you sure you want to delete this ticket?')) return
  try {
    await API.delete(`/tickets/${ticketId}`)
    setTickets(prev => prev.filter(t => t._id !== ticketId))
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete ticket')
  }
}

  const filtered = filterStatus === 'All' ? tickets : tickets.filter(t => t.status === filterStatus)

  return (
    <Layout>
      <div className="p-8">
        {/* Header — no role label */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-400 text-sm mt-1">Track and manage your support requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: tickets.length, color: 'text-cyan-400' },
            { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: 'text-blue-400' },
            { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: 'text-yellow-400' },
            { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: 'text-emerald-400' }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Empty state — centered submit button */}
        {!loading && tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              🎫
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No tickets yet</h3>
            <p className="text-slate-400 text-sm mb-8">Submit your first support request and our AI will handle the rest</p>
            <button onClick={() => navigate('/submit-ticket')}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              + Submit Your First Ticket
            </button>
          </div>
        ) : (
          <>
            {/* Filter + New Ticket Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((f) => (
                  <button key={f} onClick={() => setFilterStatus(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === f ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    style={filterStatus === f
                      ? { background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }
                      : { background: '#1e293b', border: '1px solid #334155' }}>
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => navigate('/submit-ticket')}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                + New Ticket
              </button>
            </div>

            {/* Tickets List */}
            {loading ? (
              <div className="text-center py-16 text-slate-500">Loading tickets...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500">No tickets found for this filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((ticket) => (
                  <div key={ticket._id} onClick={() => setSelectedTicket(ticket)}
                    className="rounded-2xl p-5 cursor-pointer transition-all hover:border-cyan-500/30 group"
                    style={{ background: '#1e293b', border: '1px solid #334155' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="mono text-xs text-slate-500">#{ticket._id?.slice(-8).toUpperCase()}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                        </div>
                        <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{ticket.title}</h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-1">{ticket.aiSummary}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-500 text-xs">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        <p className="text-slate-500 text-xs mt-1">{ticket.category}</p>
                        <p className="text-cyan-500 text-xs mt-2">View →</p>
                        {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
  <button
    onClick={(e) => {
      e.stopPropagation()
      handleDelete(ticket._id)
    }}
    className="text-red-400 text-xs font-medium mt-2 block"
    style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
    🗑 Delete
  </button>
)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedTicket && (
        <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </Layout>
  )
}

export default CustomerDashboard