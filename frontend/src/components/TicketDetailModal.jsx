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

const TicketDetailModal = ({ ticket, onClose }) => {
  if (!ticket) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#1e293b', border: '1px solid #334155' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700 flex items-start justify-between">
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="mono text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                #{ticket._id?.slice(-8).toUpperCase()}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
              
            </div>
            <h2 className="text-lg font-bold text-white">{ticket.title}</h2>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-all">
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* AI Summary */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-cyan-400 text-sm">🤖</span>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">AI Summary</p>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{ticket.aiSummary}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 rounded-xl p-4">
              {ticket.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Category', value: ticket.category, icon: '📁' },
              { label: 'Assigned Team', value: ticket.assignedTeam?.replace('_', ' '), icon: '👥' },
              { label: 'Created', value: new Date(ticket.createdAt).toLocaleString(), icon: '🕐' },
              { label: 'Last Updated', value: new Date(ticket.updatedAt).toLocaleString(), icon: '🔄' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-slate-500 text-xs mb-1">{item.icon} {item.label}</p>
                <p className="text-white text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Customer Info */}
          {ticket.customer && typeof ticket.customer === 'object' && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Submitted By</p>
              <p className="text-white text-sm font-medium">{ticket.customer.name}</p>
              <p className="text-slate-400 text-xs">{ticket.customer.email}</p>
            </div>
          )}

          {/* Resolution */}
          {ticket.remarks && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-emerald-400 text-sm">✅</span>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Team Response</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{ticket.remarks}</p>
              {ticket.resolvedAt && (
                <p className="text-slate-500 text-xs mt-2">
                  Resolved on {new Date(ticket.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketDetailModal