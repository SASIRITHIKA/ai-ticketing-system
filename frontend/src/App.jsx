import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import TeamDashboard from './pages/TeamDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SubmitTicket from './pages/SubmitTicket'

const teamRoles = ['finance_team', 'technical_team', 'product_team', 'general_team']

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/submit-ticket" element={
            <ProtectedRoute roles={['customer']}>
              <SubmitTicket />
            </ProtectedRoute>
          } />

          {/* Team Routes */}
          <Route path="/team-dashboard" element={
            <ProtectedRoute roles={teamRoles}>
              <TeamDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App