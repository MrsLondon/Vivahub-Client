import axios from 'axios';

// Get the API URL from environment variables, with a fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://vivahub-server.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Example API methods
export const testConnection = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Booking API methods
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Create Booking Error:', error);
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get('/api/bookings');
    return response.data;
  } catch (error) {
    console.error('Get User Bookings Error:', error);
    throw error;
  }
};

export const rescheduleBooking = async (bookingId, newScheduleData) => {
  try {
    const response = await api.patch(`/api/bookings/${bookingId}/reschedule`, newScheduleData);
    return response.data;
  } catch (error) {
    console.error('Reschedule Booking Error:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    throw error;
  }
};

export default api;