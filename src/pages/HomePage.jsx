import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/api/services/search?query=${encodeURIComponent(searchTerm)}`);
      setServices(response.data);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen">
      {/* Header */}
      <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
        <img src="/src/assets/logo.png" alt="VivaHub Logo" className="h-10"/>
        <Link to="/login" className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300">
          Log In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="py-10 px-5 bg-white text-center">
        <h1 className="text-3xl font-light mb-4 text-[#4A4A4A]">
          Book Your Perfect Salon Experience
        </h1>
        <p className="max-w-2xl mx-auto text-[#4A4A4A]/80 mb-8">
          Discover top-rated salons and book beauty services with ease
        </p>
      </section>

      {/* Search Bar Section */}
      <section className="my-5 px-5 max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for services (e.g., haircut, manicure, massage)..."
            className="flex-grow p-3 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="p-3 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#8fa9b8] transition duration-300 md:px-6 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </section>

      {/* Services Section - Show either search results or featured salons */}
      <section className="py-10 px-5 bg-[#F8F8F8]">
        <h2 className="text-xl font-medium mb-6 text-[#4A4A4A] text-center">
          {services.length > 0 ? 'Search Results' : 'Featured Salons'}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-[#E0E0E0]"
              >
                <img
                  src={service.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(service.name)}`}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{service.name}</h3>
                  <p className="text-sm text-[#4A4A4A]/80 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#4A4A4A]">${service.price}</span>
                    <button className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [1, 2, 3, 4, 5, 6].map((salon) => (
              <div
                key={salon}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-[#E0E0E0]"
              >
                <img
                  src={`https://via.placeholder.com/400x300?text=Salon+${salon}`}
                  alt={`Salon ${salon}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">Luxe Beauty Salon #{salon}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-[#FADADD]">★★★★☆</span>
                    <span className="text-sm text-[#4A4A4A]/60 ml-2">(24 reviews)</span>
                  </div>
                  <p className="text-sm text-[#4A4A4A]/80 mb-3">Hair • Nails • Spa</p>
                  <button className="w-full py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-5 bg-white">
        <h2 className="text-xl font-medium mb-8 text-[#4A4A4A] text-center">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            { 
              text: "The booking process was seamless and the salon exceeded my expectations!", 
              author: "Emma S.", 
              rating: 5 
            },
            { 
              text: "I love how easy VivaHub makes it to find quality salons in my area.", 
              author: "Michael T.", 
              rating: 4 
            },
            { 
              text: "Professional services every time. Highly recommend to anyone looking for beauty services.", 
              author: "Sarah L.", 
              rating: 5 
            }
          ].map((review, index) => (
            <div
              key={index}
              className="bg-[#F8F8F8] rounded-lg p-5 border border-[#E0E0E0]"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-[#FADADD]" : "text-[#E0E0E0]"}>★</span>
                ))}
              </div>
              <p className="text-[#4A4A4A] mb-4 italic">"{review.text}"</p>
              <p className="text-sm font-medium text-[#4A4A4A]">— {review.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-5 bg-[#A2B9C6] text-white text-center">
        <h2 className="text-2xl font-light mb-4">Ready to Book Your Next Appointment?</h2>
        <p className="max-w-2xl mx-auto mb-6 opacity-90">
          Join thousands of satisfied customers using VivaHub
        </p>
        <button className="px-6 py-3 bg-white text-[#4A4A4A] rounded-lg hover:bg-[#FADADD] transition duration-300">
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 bg-[#4A4A4A] text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">VivaHub</h3>
            <p className="text-sm text-white/80">
              Your premier salon booking platform
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-[#FADADD]">About</a></li>
              <li><a href="#" className="hover:text-[#FADADD]">Careers</a></li>
              <li><a href="#" className="hover:text-[#FADADD]">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-[#FADADD]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#FADADD]">Blog</a></li>
              <li><a href="#" className="hover:text-[#FADADD]">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-[#FADADD]">Privacy</a></li>
              <li><a href="#" className="hover:text-[#FADADD]">Terms</a></li>
              <li><a href="#" className="hover:text-[#FADADD]">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-white/10 text-sm text-white/60">
          &copy; {new Date().getFullYear()} VivaHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;