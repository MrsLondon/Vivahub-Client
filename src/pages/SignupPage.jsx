import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const SignupPage = () => {
  const [step, setStep] = useState('role'); // 'role', 'form'
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    // Business specific fields
    businessName: '',
    address: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep('form');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
        ...(role === 'business' && {
          businessDetails: {
            name: formData.businessName,
            address: formData.address,
          }
        }),
      };

      const response = await api.post('/api/auth/register', signupData);
      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };

  if (step === 'role') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
              <h2 className="text-center text-2xl font-medium text-[#4A4A4A]">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-[#4A4A4A]/80">
                Choose your account type
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => handleRoleSelect('customer')}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#A2B9C6] hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2B9C6]"
              >
                I'm a Customer
              </button>
              <button
                onClick={() => handleRoleSelect('business')}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#A2B9C6] hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2B9C6]"
              >
                I'm a Business
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-2xl font-medium text-[#4A4A4A]">
              Create your {role} account
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] rounded-t-md focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {role === 'business' && (
                <>
                  <div>
                    <input
                      name="businessName"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      name="address"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                      placeholder="Business Address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              <div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E0E0E0] placeholder-[#4A4A4A]/60 text-[#4A4A4A] rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#A2B9C6] hover:bg-[#8fa9b8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2B9C6]"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-sm text-[#A2B9C6] hover:underline hover:text-[#8fa9b8]">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;