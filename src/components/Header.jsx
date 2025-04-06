import { Link, useNavigate } from "react-router-dom";
import { FaSlidersH, FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { UserCircleIcon } from '@heroicons/react/24/outline';


const Header = ({ theme, toggleTheme, showFilters, toggleFilters }) => {
  // Get authentication state from context
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  return (
    <header className="p-4 bg-[#eeeeee] dark:bg-gray-800 flex justify-between items-center shadow-sm border-b border-gray-200 dark:border-gray-700">
      <Link to="/" className="flex items-center">
        <img 
          src={theme === 'light' ? "/logo.png" : "/logo-dark.png"} 
          alt="VivaHub Logo" 
          className="h-10" 
        />
      </Link>
      
      <div className="hidden md:flex space-x-4">
        <Link to="/search?query=hair" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Hair</Link>
        <Link to="/search?query=nails" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Nails</Link>
        <Link to="/search?query=spa" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Spa</Link>
        <Link to="/search?query=makeup" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Makeup</Link>
        <Link to="/search?query=facials" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Facials</Link>
        <Link to="/search?query=waxing" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Waxing</Link>
        <Link to="/search?query=massage" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Massage</Link>
        <Link to="/search?query=language" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Language</Link>
      </div>
      
      <div className="flex items-center gap-4">
      <div className="md:hidden relative z-50 flex items-center">
  <button
    onClick={toggleFilters}
    className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] transition-colors flex items-center justify-center"
  >
    <FaSlidersH className="text-xl leading-none relative top-[1px]" /> {/* Adjust alignment */}
  </button>
  {showFilters && (
    <div className="absolute top-10 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg z-50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-2">
        <Link to="/search?query=hair" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Hair</Link>
        <Link to="/search?query=nails" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Nails</Link>
        <Link to="/search?query=spa" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Spa</Link>
        <Link to="/search?query=makeup" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Makeup</Link>
        <Link to="/search?query=facials" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Facials</Link>
        <Link to="/search?query=waxing" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Waxing</Link>
        <Link to="/search?query=massage" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => toggleFilters(false)}>Massage</Link>
      </div>
    </div>
  )}
</div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[#FADADD] dark:hover:bg-[#A2B9C6] transition-colors"
          aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <FaMoon className="text-[#4A4A4A]" /> : <FaSun className="text-gray-200" />}
        </button>
        
        {/* Conditional rendering based on authentication state */}
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] dark:bg-[#FADADD] dark:text-[#4A4A4A] rounded-lg text-sm hover:bg-[#F7C6C6] hover:text-white transition-colors"
            >
              Logout
            </button>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#A2B9C6] text-white dark:bg-[#A2B9C6] dark:text-white rounded-lg text-sm hover:bg-[#8BA5B3] transition-colors"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>{user.firstName || (user.role === 'business' ? 'Business Dashboard' : 'My Profile')}</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-[#FADADD] dark:bg-[#A2B9C6] text-[#4A4A4A] dark:text-gray-800 rounded-lg text-sm hover:bg-[#A2B9C6] dark:hover:bg-[#FADADD] hover:text-white dark:hover:text-[#4A4A4A] transition-colors font-medium"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;