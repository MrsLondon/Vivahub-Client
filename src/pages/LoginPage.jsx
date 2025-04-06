import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Create axios instance with default config
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const LoginPage = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Extract returnUrl from query parameters if it exists
  const [returnUrl, setReturnUrl] = useState('');
  
  useEffect(() => {
    // Get returnUrl from query parameters when component mounts
    const params = new URLSearchParams(location.search);
    const returnPath = params.get('returnUrl');
    if (returnPath) {
      setReturnUrl(returnPath);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/login', formData);
      const { token, user } = response.data;
      console.log('Login successful:', { token, user });
      login({ ...user, token });
      
      // If there's a returnUrl, navigate there, otherwise go to the appropriate dashboard
      if (returnUrl) {
        navigate(returnUrl);
      } else if (user.role === 'customer') {
        navigate('/customer-dashboard');
      } else if (user.role === 'business') {
        navigate('/business-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Server error');
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError('An error occurred while sending the request.');
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      theme === 'light' ? 'bg-[#eeeeee]' : 'bg-gray-900'
    }`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-sm border ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-800 border-gray-700'
      }`}>
        <div>
          <h2 className={`text-center text-2xl font-medium ${
            theme === 'light' ? 'text-[#4A4A4A]' : 'text-gray-200'
          }`}>
            Sign in to your account
          </h2>
          <p className={`mt-2 text-center text-sm ${
            theme === 'light' ? 'text-[#4A4A4A]/80' : 'text-gray-300'
          }`}>
            Access your VivaHub dashboard
          </p>
        </div>

        {error && (
          <div className={`p-3 rounded-lg ${
            theme === 'light' 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-red-900 border border-red-700 text-red-100'
          }`}>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-[#4A4A4A]/60 rounded-t-md focus:outline-none focus:ring-2 sm:text-sm ${
                  theme === 'light'
                    ? 'border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]'
                    : 'border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200'
                }`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-[#4A4A4A]/60 rounded-b-md focus:outline-none focus:ring-2 sm:text-sm ${
                  theme === 'light'
                    ? 'border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]'
                    : 'border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200'
                }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                theme === 'light'
                  ? 'text-white bg-[#A2B9C6] hover:bg-[#8BA5B3] focus:ring-[#A2B9C6]'
                  : 'text-[#4A4A4A] bg-[#FADADD] hover:bg-[#f0c8cc] focus:ring-[#FADADD]'
              }`}
            >
              Sign in
            </button>
          </div>
          
          <div className="text-center">
            <Link 
              to="/signup" 
              className={`text-sm ${
                theme === 'light'
                  ? 'text-[#A2B9C6] hover:text-[#8BA5B3]'
                  : 'text-[#FADADD] hover:text-[#f0c8cc]'
              }`}
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;