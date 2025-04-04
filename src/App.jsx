import { Routes, Route } from 'react-router-dom'
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
 * Layout component that wraps content with Navbar
 * Used for all pages except HomePage and auth pages
 */
const NavbarLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

/**
 * Main App component that sets up:
 * 1. Routing with react-router-dom
 * 2. Authentication context provider
 * 3. Conditional navigation with Navbar (not shown on HomePage)
 * 4. Protected routes for authenticated users
 * 5. Toast notifications system
 * 6. Theme provider for light/dark mode
 */
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-900">
          {/* Route configuration */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/salon/:salonId" element={
              <NavbarLayout>
                <SalonDetailsPage />
              </NavbarLayout>
            } />
            <Route path="/search" element={
              <NavbarLayout>
                <SearchResults />
              </NavbarLayout>
            } />
            <Route path="/login" element={
              <NavbarLayout>
                <LoginPage />
              </NavbarLayout>
            } />
            <Route path="/signup" element={
              <NavbarLayout>
                <SignupPage />
              </NavbarLayout>
            } />
            <Route path="/unauthorized" element={
              <NavbarLayout>
                <UnauthorizedPage />
              </NavbarLayout>
            } />
            
            {/* Protected routes with role-based access */}
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <NavbarLayout>
                    <CustomerDashboard />
                  </NavbarLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-dashboard"
              element={
                <ProtectedRoute allowedRoles={['business']}>
                  <NavbarLayout>
                    <BusinessDashboard />
                  </NavbarLayout>
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Global toast notifications */}
          <Toaster position="top-center" />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;