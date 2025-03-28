import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="VivaHub Logo" className="h-10"/>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-[#4A4A4A]">
              {user.role === 'business' ? 'Business' : 'Customer'}: {user.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
            >
              Logout
            </button>
          </>
        ) : !isAuthPage && (
          <Link
            to="/login"
            className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
