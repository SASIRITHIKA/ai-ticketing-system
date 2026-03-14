import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets/my')
      setTickets(res.data)
    } catch (err) {
      setError('Failed to load tickets')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>
            <p className="text-gray-500 text-sm mt-1">Track all your support requests</p>
          </div>
          <button
            onClick={() => navigate('/submit-ticket')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition duration-200"
          >
            + New Ticket
          </button>
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

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading tickets...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tickets yet</p>
            <p className="text-gray-400 text-sm mt-1">Submit your first support ticket</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Ticket Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
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

                {/* Details */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📁 {ticket.category}</span>
                  <span>👥 {ticket.assignedTeam.replace('_', ' ')}</span>
                  <span>🕐 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Remarks */}
                {ticket.remarks && (
                  <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-4 py-2">
                    <p className="text-xs font-semibold text-green-600 mb-1">✅ Team Response</p>
                    <p className="text-sm text-green-800">{ticket.remarks}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard