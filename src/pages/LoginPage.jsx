import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Create axios instance with default config
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

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
      login({ ...user, token });
      if (user.role === 'customer') {
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
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-2xl font-medium text-[#4A4A4A]">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-[#4A4A4A]/80">
              Access your VivaHub dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#A2B9C6] hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2B9C6]"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to="/signup" className="text-sm text-[#A2B9C6] hover:underline hover:text-[#8fa9b8]">
              New user? Sign up here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;