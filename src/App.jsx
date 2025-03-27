import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import CustomerDashboard from './pages/CustomerDashboard'
import BusinessDashboard from './pages/BusinessDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'

const App = () => {
  return (

    <header className="p-4 bg-[#eeeeee] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <img src="/src/assets/logo.png" alt="VivaHub Logo" className="h-10" />
        <nav className="flex space-x-4">
          <Link to="/" className="text-[#4A4A4A] hover:text-[#A2B9C6] transition-colors">
            Home
          </Link>
          {!user ? (
            <Link to="/login" className="text-[#4A4A4A] hover:text-[#A2B9C6] transition-colors">
              Login
            </Link>
          ) : (
            <>
              {user.role === "business" && (
                <Link
                  to="/business-dashboard"
                  className="text-[#4A4A4A] hover:text-[#A2B9C6] transition-colors"
                >
                  Business Dashboard
                </Link>
              )}
              {user.role === "customer" && (
                <Link
                  to="/customer-dashboard"
                  className="text-[#4A4A4A] hover:text-[#A2B9C6] transition-colors"
                >
                  Customer Dashboard
                </Link>
              )}
            </>
          )}
        </nav>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-[#4A4A4A]">Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
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
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-dashboard"
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App
