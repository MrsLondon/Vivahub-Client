import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import CustomerDashboard from './pages/CustomerDashboard'
import BusinessDashboard from './pages/BusinessDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import SalonDetailsPage from "./pages/SalonDetailsPage";
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext'

/**
 * Main App component that sets up:
 * 1. Routing with react-router-dom
 * 2. Authentication context provider
 * 3. Global navigation with Navbar
 * 4. Protected routes for authenticated users
 * 5. Toast notifications system
 * 6. Theme provider for light/dark mode
 */
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-900">
            {/* Global navigation bar */}
            <Navbar />
            
            {/* Route configuration */}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/salon/:salonId" element={<SalonDetailsPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Protected routes with role-based access */}
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

            {/* Global toast notifications */}
            <Toaster position="top-center" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App