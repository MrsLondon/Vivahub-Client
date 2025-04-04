
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import CustomerDashboard from './pages/CustomerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import SalonDetailsPage from './pages/SalonDetailsPage';
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';


const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>

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
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-dashboard"
            element={
              <ProtectedRoute allowedRoles={["business"]}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
