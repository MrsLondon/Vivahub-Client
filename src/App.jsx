import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { testConnection } from './services/api'
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

// Separate component for navigation to use useAuth hook
const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex space-x-4">
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
            <button 
              onClick={logout}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Logout
            </button>
          </>
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
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/business-dashboard"
              element={
                <ProtectedRoute allowedRoles={['business']}>
                  <div>Business Dashboard (Create this component)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <div>Customer Dashboard (Create this component)</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
