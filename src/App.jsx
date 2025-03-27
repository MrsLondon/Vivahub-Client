import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { testConnection } from './services/api'
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import CustomerDashboard from './pages/CustomerDashboard'
import BusinessDashboard from './pages/BusinessDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

// Separate component for navigation to use useAuth hook
const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-blue-400 transition-colors">Home</Link>
          {!user ? (
            <Link to="/login" className="text-white hover:text-blue-400 transition-colors">Login</Link>
          ) : (
            <>
              {user.role === 'business' && (
                <Link to="/business-dashboard" className="text-white hover:text-blue-400 transition-colors">Business Dashboard</Link>
              )}
              {user.role === 'customer' && (
                <Link to="/customer-dashboard" className="text-white hover:text-blue-400 transition-colors">Customer Dashboard</Link>
              )}
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user.name}</span>
            <button 
              onClick={logout}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

function App() {
  const [message, setMessage] = useState('Loading...')
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await testConnection()
        setMessage(response)
      } catch (err) {
        setError('Failed to connect to backend')
        console.error('Connection error:', err)
      }
    }

    checkBackendConnection()
  }, [])

  return (

    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route
                path="/business-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );


}

export default App
