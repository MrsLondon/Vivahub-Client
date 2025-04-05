import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import SalonDetailsPage from "./pages/SalonDetailsPage";
import BookingPage from './pages/BookingPage'
import BusinessProfile from "./pages/BusinessProfile";
import SearchResults from "./pages/SearchResults";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { BookingProvider } from "./context/BookingContext";

/**
 * Layout component that wraps content with Navbar
 * Used for all pages except HomePage
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
        <BookingProvider>
          <div className="min-h-screen bg-[#F8F8F8] dark:bg-gray-900">
            {/* Route configuration */}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Homepage />} />
              <Route
                path="/salons/:salonId"
                element={
                  
                    <SalonDetailsPage />
                
                }
              />
              <Route
                path="/search"
                element={
                  <NavbarLayout>
                    <SearchResults />
                  </NavbarLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <NavbarLayout>
                    <LoginPage />
                  </NavbarLayout>
                }
              />
              <Route
                path="/signup"
                element={
                
                    <SignupPage />
                 
                }
                
              />

              <Route path="/booking" element={<BookingPage />} />

              <Route
                path="/salons/update/:id"
                element={
                  <NavbarLayout>
                    <BusinessProfile />
                  </NavbarLayout>
                }
              />
              <Route
                path="/unauthorized"
                element={
                  <NavbarLayout>
                    <UnauthorizedPage />
                  </NavbarLayout>
                }
              />

              {/* Protected routes with role-based access */}
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <NavbarLayout>
                      <CustomerDashboard />
                    </NavbarLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["business"]}>
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
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
