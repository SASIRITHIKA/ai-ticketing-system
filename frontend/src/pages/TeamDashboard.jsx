import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
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
  const [error, setError] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [status, setStatus] = useState('Resolved')
  const [resolving, setResolving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets/team')
      setTickets(res.data)
    } catch (err) {
      setError('Failed to load tickets')
    }
    setLoading(false)
  }

  const handleResolve = async (ticketId) => {
    if (!remarks.trim()) {
      alert('Please enter remarks before resolving')
      return
    }
    setResolving(true)
    try {
      await API.put(`/tickets/${ticketId}/resolve`, { remarks, status })
      await fetchTickets()
      setSelectedTicket(null)
      setRemarks('')
      setStatus('Resolved')
    } catch (err) {
      alert('Failed to update ticket')
    }
    setResolving(false)
  }

  const filteredTickets = filterStatus === 'All'
    ? tickets
    : tickets.filter(t => t.status === filterStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {teamLabels[user?.role]} Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and resolve your assigned tickets
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: tickets.length, color: 'text-blue-600' },
            { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: 'text-yellow-600' },
            { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: 'text-orange-600' },
            { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: 'text-green-600' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex space-x-2 mb-6">
          {['All', 'Open', 'In Progress', 'Resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                filterStatus === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tickets */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading tickets...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Ticket Header */}
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

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>

                {/* AI Summary */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 mb-3">
                  <p className="text-xs font-semibold text-blue-600 mb-1">🤖 AI Summary</p>
                  <p className="text-sm text-blue-800">{ticket.aiSummary}</p>
                </div>

                {/* Details */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>📁 {ticket.category}</span>
                  <span>🕐 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Existing Remarks */}
                {ticket.remarks && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 mb-4">
                    <p className="text-xs font-semibold text-green-600 mb-1">✅ Resolution Remarks</p>
                    <p className="text-sm text-green-800">{ticket.remarks}</p>
                  </div>
                )}

                {/* Resolve Panel */}
                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                  <>
                    {selectedTicket === ticket._id ? (
                      <div className="border border-gray-200 rounded-lg p-4 mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Update Ticket</p>

                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          rows={3}
                          placeholder="Add your remarks or resolution details..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResolve(ticket._id)}
                            disabled={resolving}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm transition duration-200 disabled:opacity-50"
                          >
                            {resolving ? 'Updating...' : 'Update Ticket'}
                          </button>
                          <button
                            onClick={() => { setSelectedTicket(null); setRemarks('') }}
                            className="flex-1 border border-gray-300 text-gray-600 font-medium py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTicket(ticket._id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg text-sm transition duration-200"
                      >
                        Respond to Ticket
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamDashboard