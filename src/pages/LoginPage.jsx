import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const LoginPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [returnUrl, setReturnUrl] = useState('');
  
  useEffect(() => {
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
    <div className={`min-h-screen font-body transition-colors duration-300 ${
      theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"
    }`}>
      {/* Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className={`rounded-xl p-8 shadow-sm ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h2 className="text-3xl font-heading font-semibold mb-2 text-center">
            Sign in to your account
          </h2>
          <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg ${
              theme === "light" 
                ? "bg-red-100 text-red-700" 
                : "bg-red-900 text-red-100"
            }`}>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                      : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700"
                  }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg transition-colors ${
                theme === "light"
                  ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                  : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
              }`}
            >
              Sign in
            </button>
            
            <div className="text-center">
              <Link
                to="/signup"
                className={`text-sm ${
                  theme === "light"
                    ? "text-[#A2B9C6] hover:text-[#8fa9b8]"
                    : "text-[#FADADD] hover:text-[#f0c8cc]"
                }`}
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;