import { useState, useEffect } from 'react'
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

const teamLabels = {
  finance_team: 'Finance Team',
  technical_team: 'Technical Team',
  product_team: 'Product Team',
  general_team: 'General Team'
}

const TeamDashboard = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [resolveTicket, setResolveTicket] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [status, setStatus] = useState('Resolved')
  const [resolving, setResolving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets/team')
      setTickets(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleResolve = async (ticketId) => {
    if (!remarks.trim()) { alert('Please enter remarks'); return }
    setResolving(true)
    try {
      await API.put(`/tickets/${ticketId}/resolve`, { remarks, status })
      await fetchTickets()
      setResolveTicket(null)
      setRemarks('')
    } catch (err) { alert('Failed to update ticket') }
    setResolving(false)
  }

  const filtered = filterStatus === 'All' ? tickets : tickets.filter(t => t.status === filterStatus)

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">{teamLabels[user?.role]} Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and resolve your assigned tickets</p>
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

        {/* Filter */}
        <div className="flex space-x-2 mb-6">
          {['All', 'Open', 'In Progress', 'Resolved'].map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === f ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
              style={filterStatus === f
                ? { background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }
                : { background: '#1e293b', border: '1px solid #334155' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Tickets */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ticket) => (
              <div key={ticket._id} className="rounded-2xl p-5 transition-all"
                style={{ background: '#1e293b', border: '1px solid #334155' }}>
                {/* Ticket Header - clickable for detail */}
                <div className="flex items-start justify-between mb-3 cursor-pointer group"
                  onClick={() => setSelectedTicket(ticket)}>
                  <div className="flex-1 mr-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="mono text-xs text-slate-500">#{ticket._id?.slice(-8).toUpperCase()}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                      {ticket.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      From: {ticket.customer?.name} · {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-slate-500 text-xs mt-1">Click to view →</span>
                </div>

                {/* AI Summary */}
                <div className="rounded-xl px-4 py-3 mb-3"
                  style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                  <p className="text-cyan-400 text-xs font-bold mb-1">🤖 AI Summary</p>
                  <p className="text-slate-300 text-sm">{ticket.aiSummary}</p>
                </div>

                {/* Resolve Panel */}
                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                  <>
                    {resolveTicket === ticket._id ? (
                      <div className="rounded-xl p-4 mt-2" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                          className="w-full rounded-xl px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          style={{ background: '#1e293b', border: '1px solid #334155' }}>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3}
                          placeholder="Add your resolution remarks..."
                          className="w-full rounded-xl px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                          style={{ background: '#1e293b', border: '1px solid #334155' }} />
                        <div className="flex space-x-2">
                          <button onClick={() => handleResolve(ticket._id)} disabled={resolving}
                            className="flex-1 py-2 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            {resolving ? 'Updating...' : 'Update Ticket'}
                          </button>
                          <button onClick={() => { setResolveTicket(null); setRemarks('') }}
                            className="flex-1 py-2 rounded-xl text-slate-300 font-bold text-sm"
                            style={{ background: '#334155' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setResolveTicket(ticket._id)}
                        className="mt-2 px-4 py-2 rounded-xl text-cyan-400 text-sm font-medium transition-all hover:text-white"
                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                        Respond to Ticket →
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </Layout>
  )
}

export default TeamDashboard