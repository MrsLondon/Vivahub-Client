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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/salon/:salonId" element={<SalonDetailsPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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