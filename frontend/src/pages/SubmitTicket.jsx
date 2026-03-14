import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../api/axios'

const SubmitTicket = () => {
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/tickets', formData)
      setSuccess(res.data.ticket)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket')
    }
    setLoading(false)
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ticket Submitted!</h2>
            <p className="text-gray-500 mb-6">Our AI has analyzed your ticket</p>

            {/* AI Results */}
            <div className="bg-blue-50 rounded-xl p-5 text-left mb-6">
              <p className="text-sm font-bold text-blue-600 mb-3">🤖 AI Analysis Result</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-semibold text-gray-800">{success.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <span className="text-sm font-semibold text-gray-800">{success.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assigned To</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {success.assignedTeam.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gray-50 rounded-xl p-5 text-left mb-8">
              <p className="text-sm font-bold text-gray-600 mb-2">📝 AI Summary</p>
              <p className="text-sm text-gray-700">{success.aiSummary}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => { setSuccess(null); setFormData({ title: '', description: '' }) }}
                className="flex-1 border border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition duration-200"
              >
                Submit Another
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                View My Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 text-sm font-medium hover:underline mb-4 block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Submit a Ticket</h1>
          <p className="text-gray-500 text-sm mt-1">
            Describe your issue and our AI will classify and route it automatically
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief summary of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>

            {/* AI Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
              <p className="text-sm text-blue-700">
                🤖 <strong>AI Powered:</strong> Your ticket will be automatically classified,
                prioritized and routed to the right team.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? '🤖 AI is analyzing your ticket...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitTicket