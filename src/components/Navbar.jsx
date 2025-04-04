import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { FaUser, FaFilter } from "react-icons/fa";
import { useState } from "react";

/**
 * Navbar component that handles navigation and authentication state
 * Features:
 * - Shows navigation links for different service categories
 * - Responsive design with mobile menu
 * - Conditional rendering of login/profile based on auth state
 */
const Navbar = () => {
  // Get authentication state and functions from AuthContext
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // State for mobile menu
  const [showFilters, setShowFilters] = useState(false);

  // Debug logs for authentication state
  console.log("Navbar - isAuthenticated:", isAuthenticated);
  console.log("Navbar - user:", user);
  console.log("Navbar - current path:", location.pathname);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    if (user?.role === 'business') {
      navigate('/business-dashboard');
    } else if (user?.role === 'customer') {
      navigate('/customer-dashboard');
    }
  };

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="VivaHub Logo" className="h-10"/>
      </Link>
      
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-4">
        <Link to="/filter/hair" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Hair</Link>
        <Link to="/filter/nails" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Nails</Link>
        <Link to="/filter/spa" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Spa</Link>
        <Link to="/filter/makeup" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Makeup</Link>
        <Link to="/filter/facials" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Facials</Link>
        <Link to="/filter/waxing" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Waxing</Link>
        <Link to="/filter/massage" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Massage</Link>
        <Link to="/filter/language" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium">Language</Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-[#4A4A4A] hover:text-[#A2B9C6] transition duration-300"
          >
            <FaFilter size={20} />
          </button>
          
          {/* Mobile Menu Dropdown */}
          {showFilters && (
            <div className="absolute top-10 right-0 w-48 bg-white shadow-lg z-10 p-4 rounded-lg">
              <div className="flex flex-col space-y-2">
                <Link to="/filter/hair" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Hair</Link>
                <Link to="/filter/nails" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Nails</Link>
                <Link to="/filter/spa" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Spa</Link>
                <Link to="/filter/makeup" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Makeup</Link>
                <Link to="/filter/facials" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Facials</Link>
                <Link to="/filter/waxing" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Waxing</Link>
                <Link to="/filter/massage" className="text-[#4A4A4A] hover:text-[#A2B9C6] font-medium" onClick={() => setShowFilters(false)}>Massage</Link>
              </div>
            </div>
          )}
        </div>

        {/* Authentication Buttons */}
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#F7C6C6] hover:text-white transition duration-300"
            >
              Logout
            </button>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#A2B9C6] text-white rounded-lg text-sm hover:bg-[#8BA5B3] transition duration-300"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>{user.firstName || (user.role === 'business' ? 'Business Dashboard' : 'My Profile')}</span>
            </button>
          </>
        ) : !isAuthPage && (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
          >
            <UserCircleIcon className="h-5 w-5" />
            <span>Log In</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
