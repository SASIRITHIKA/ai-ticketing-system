import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import API from '../api/axios'

const SubmitTicket = () => {
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

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

  const priorityColors = {
    Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    High: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    Critical: 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  if (success) {
    return (
      <Layout>
        <div className="p-8 max-w-2xl ">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <div className="p-8 text-center border-b border-slate-700">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                ✅
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Ticket Submitted!</h2>

            </div>

            <div className="p-8 space-y-4">
              {/* AI Results */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">🤖 AI Analysis</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Category', value: success.category },
                    { label: 'Assigned To', value: success.assignedTeam?.replace('_', ' ') },
                    { label: 'Priority', value: success.priority }
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                      <p className={`text-sm font-bold px-2 py-1 rounded-lg border ${
                        item.label === 'Priority' ? priorityColors[item.value] : 'text-white bg-slate-700/50 border-slate-600'
                      }`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div className="rounded-xl p-4 bg-slate-800/50">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">📝 AI Summary</p>
                <p className="text-slate-300 text-sm leading-relaxed">{success.aiSummary}</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => { setSuccess(null); setFormData({ title: '', description: '' }) }}
                  className="flex-1 py-3 rounded-xl text-slate-300 font-bold text-sm transition-all"
                  style={{ background: '#334155', border: '1px solid #475569' }}>
                  Submit Another
                </button>
                <button onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                  View My Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Submit a Ticket</h1>
          <p className="text-slate-400 text-sm mt-1">Describe your issue and AI will handle the rest</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ticket Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                style={{ background: '#0f172a', border: '1px solid #334155' }}
                placeholder="Brief summary of your issue" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={6}
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                style={{ background: '#0f172a', border: '1px solid #334155' }}
                placeholder="Describe your issue in detail..." />
            </div>

            

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              {loading ? '🤖 AI is analyzing your ticket...' : 'Submit Ticket →'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default SubmitTicket