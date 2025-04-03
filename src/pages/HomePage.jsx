import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaSearch, FaTimes, FaLanguage, FaFilter, FaMoon, FaSun } from "react-icons/fa";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguageSearch, setShowLanguageSearch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Fetch languages from backend
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services/languages`);
        setLanguages(response.data);
      } catch (err) {
        console.error('Failed to fetch languages:', err);
        setError('Failed to load languages');
      }
    };
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    const params = new URLSearchParams({
      filterType: selectedLanguage ? 'language' : 'service',
      ...(searchTerm && { query: searchTerm }),
      ...(selectedLanguage && { language: selectedLanguage })
    });
    
    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setShowLanguageSearch(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={`font-body leading-relaxed min-h-screen transition-colors duration-300
      bg-white dark:bg-gray-900
      text-[#4A4A4A] dark:text-gray-200`}>
      
      {/* Header Section */}
      <header className="p-4 bg-[#eeeeee] dark:bg-gray-800 flex justify-between items-center shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <img 
            src={theme === 'light' ? "/logo.png" : "/logo-dark.png"} 
            alt="VivaHub Logo" 
            className="h-10" 
          />
        </Link>
        
        <div className="hidden md:flex space-x-4">
          <Link to="/filter/hair" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Hair</Link>
          <Link to="/filter/nails" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Nails</Link>
          <Link to="/filter/spa" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Spa</Link>
          <Link to="/filter/makeup" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Makeup</Link>
          <Link to="/filter/facials" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Facials</Link>
          <Link to="/filter/waxing" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Waxing</Link>
          <Link to="/filter/massage" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Massage</Link>
          <Link to="/filter/language" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium">Language</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="md:hidden relative">
            <button
              onClick={toggleFilters}
              className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] transition-colors"
            >
              <FaFilter size={20} />
            </button>
            {showFilters && (
              <div className="absolute top-10 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                  <Link to="/filter/hair" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Hair</Link>
                  <Link to="/filter/nails" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Nails</Link>
                  <Link to="/filter/spa" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Spa</Link>
                  <Link to="/filter/makeup" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Makeup</Link>
                  <Link to="/filter/facials" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Facials</Link>
                  <Link to="/filter/waxing" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Waxing</Link>
                  <Link to="/filter/massage" className="text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] font-medium" onClick={() => setShowFilters(false)}>Massage</Link>
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
          
          <Link
            to="/login"
            className="px-4 py-2 bg-[#FADADD] dark:bg-[#A2B9C6] text-[#4A4A4A] dark:text-gray-800 rounded-lg text-sm hover:bg-[#A2B9C6] dark:hover:bg-[#FADADD] hover:text-white dark:hover:text-[#4A4A4A] transition-colors font-medium"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-cover bg-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/video-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
        
        <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50"></div>
        
        <div className="relative z-10 text-center px-5">
          <h1 className="font-heading text-3xl font-normal mb-4 text-white tracking-tight drop-shadow-lg">
            Book Your Perfect Salon Experience
          </h1>
          <p className="font-body text-white/80 dark:text-white/90 mb-8 text-lg drop-shadow-lg">
            Discover top-rated salons and book beauty services with ease
          </p>
          
          {/* Search Section */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        selectedLanguage
                          ? `Search services in ${selectedLanguage}...`
                          : "Search for services or salons..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="font-body w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] dark:focus:ring-[#FADADD] focus:border-[#A2B9C6] dark:focus:border-[#FADADD] bg-white dark:bg-gray-800 text-[#4A4A4A] dark:text-gray-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    {(searchTerm || selectedLanguage) && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                {/* Language Search Link */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowLanguageSearch(!showLanguageSearch)}
                    className="font-body text-[#A2B9C6] dark:text-[#FADADD] hover:text-[#91A7B4] dark:hover:text-[#f0c8cc] text-sm flex items-center gap-2"
                  >
                    <FaLanguage />
                    Search by language
                  </button>
                  <button
                    onClick={handleSearch}
                    className="font-body px-6 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
                  >
                    Search
                  </button>
                </div>

                {/* Language Search Dropdown */}
                {showLanguageSearch && (
                  <div className="relative mt-2">
                    <input
                      type="text"
                      placeholder="Type to search languages..."
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="font-body w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#A2B9C6] dark:focus:ring-[#FADADD] focus:border-[#A2B9C6] dark:focus:border-[#FADADD] bg-white dark:bg-gray-800 text-[#4A4A4A] dark:text-gray-200"
                    />
                    {selectedLanguage && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                        {languages
                          .filter((lang) =>
                            lang.name
                              .toLowerCase()
                              .includes(selectedLanguage.toLowerCase())
                          )
                          .map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setSelectedLanguage(lang.code);
                                setShowLanguageSearch(false);
                                handleSearch();
                              }}
                              className="font-body w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-[#4A4A4A] dark:text-gray-200 flex items-center"
                            >
                              <img
                                src={`https://flagcdn.com/w20/${lang.country}.png`}
                                alt={lang.name}
                                className="w-5 h-4 mr-2"
                              />
                              {lang.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-10 px-5 bg-[#F8F8F8] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <img
              src="/coupon.png"
              alt="Discount Coupon"
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Get a Special Discount</h3>
            <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300 mb-4">
              Claim your exclusive discount coupon for your next salon visit.
            </p>
            <Link
              to="/special-offers"
              className="font-body px-6 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
            >
              Claim Now
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <img
              src="/nails1.png"
              alt="Top Rated Salons"
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Top Rated Salons</h3>
            <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300 mb-4">
              Explore the highest-rated salons in your area and book today.
            </p>
            <Link
              to="/filter/top-rated"
              className="font-body px-6 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
            >
              View Salons
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-heading text-xl font-medium mb-8 text-[#4A4A4A] dark:text-gray-200 text-center">
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
              className="bg-[#F8F8F8] dark:bg-gray-800 rounded-lg p-5 border border-[#E0E0E0] dark:border-gray-700"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-[#FADADD] dark:text-[#dcbd73]" : "text-[#E0E0E0] dark:text-gray-500"}>★</span>
                ))}
              </div>
              <p className="font-body text-[#4A4A4A] dark:text-gray-300 mb-4 italic">"{review.text}"</p>
              <p className="font-body text-sm font-medium text-[#4A4A4A] dark:text-gray-200">— {review.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 px-5 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] text-center border-b border-[#A2B9C6] dark:border-[#FADADD]">
        <h2 className="font-heading text-2xl font-normal mb-4 tracking-tight">Ready to Book Your Next Appointment?</h2>
        <p className="font-body max-w-2xl mx-auto mb-6 opacity-90">
          Join thousands of satisfied customers using VivaHub
        </p>
        <Link to="/signup">
          <button className="font-body px-6 py-3 bg-white dark:bg-gray-900 text-[#4A4A4A] dark:text-gray-200 rounded-lg hover:bg-[#FADADD] dark:hover:bg-[#A2B9C6] transition-colors">
            Sign Up Now
          </button>
        </Link>
      </section>

      {/* About the App Section */}
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-xl font-medium mb-6 text-[#4A4A4A] dark:text-gray-200">Why Choose VivaHub?</h2>
          <p className="font-body text-[#4A4A4A]/80 dark:text-gray-300 mb-8">
            VivaHub is your one-stop platform for discovering and booking top-rated salons. 
            Enjoy seamless booking, exclusive discounts, and access to the best beauty services in your area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="/beauty-salon-pink.png" alt="Feature 1" className="mx-auto mb-4" />
              <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Discover Top Salons</h3>
              <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300">
                Find the best salons near you with verified reviews and ratings.
              </p>
            </div>
            <div className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="/discount.png" alt="Feature 2" className="mx-auto mb-4" />
              <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Exclusive Discounts</h3>
              <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300">
                Enjoy special offers and discounts on your favorite services.
              </p>
            </div>
            <div className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="/computer.png" alt="Feature 3" className="mx-auto mb-4" />
              <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Easy Booking</h3>
              <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300">
                Book your appointments in just a few clicks, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Business Owners Section */}
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Left Side: Text Content */}
          <div className="text-center md:text-left flex flex-col justify-center">
            <h2 className="font-heading text-xl font-medium mb-6 text-[#4A4A4A] dark:text-gray-200">Are You a Salon Owner?</h2>
            <p className="font-body text-[#4A4A4A]/80 dark:text-gray-300 mb-8">
              Join VivaHub and grow your business by reaching thousands of potential customers. 
              Showcase your services, manage bookings, and increase your revenue.
              <br />
              <br />
              <Link
                to="/signup"
                className="font-body px-4 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
              >
                Partner with Us
              </Link>
            </p>
          </div>

          {/* Right Side: Regular Image */}
          <div className="flex justify-center">
            <img
              src="/business-owner1.jpg"
              alt="Business Owner"
              className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </section>

      {/* Social Media Links Section */}
      <section className="py-12 px-5 bg-[#F8F8F8] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-xl font-medium mb-6 text-[#4A4A4A] dark:text-gray-200">Follow Us on Social Media</h2>
          <p className="font-body text-[#4A4A4A]/80 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Stay updated with the latest news, offers, and beauty tips from VivaHub.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] transition-colors border border-[#E0E0E0] dark:border-gray-600 rounded-full hover:border-[#A2B9C6] dark:hover:border-[#FADADD]"
            >
              <FiFacebook size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] transition-colors border border-[#E0E0E0] dark:border-gray-600 rounded-full hover:border-[#A2B9C6] dark:hover:border-[#FADADD]"
            >
              <FiInstagram size={22} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-5 bg-[#4A4A4A] dark:bg-gray-900 text-white dark:text-gray-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-lg font-medium mb-4">VivaHub</h3>
            <p className="font-body text-sm text-white/80 dark:text-gray-400">
              Your premier salon booking platform
            </p>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">About</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Careers</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Help Center</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Blog</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Privacy</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Terms</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="font-body max-w-6xl mx-auto pt-8 mt-8 border-t border-white/10 dark:border-gray-700 text-sm text-white/60 dark:text-gray-500">
          &copy; {new Date().getFullYear()} VivaHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;