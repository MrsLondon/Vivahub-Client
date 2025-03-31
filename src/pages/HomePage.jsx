import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaSearch, FaTimes, FaLanguage, FaFilter, FaMoon, FaSun } from "react-icons/fa";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { useTheme } from '../context/ThemeContext';

// API base URL from environment variables, fallback to localhost if not set
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Languages list
const LANGUAGES = [
  'English', 'French', 'Spanish', 'Arabic', 'Chinese', 'Hindi',
  'Portuguese', 'Russian', 'Japanese', 'Korean', 'German', 'Italian',
  'Dutch', 'Polish', 'Turkish', 'Vietnamese', 'Thai', 'Greek',
  'Hebrew', 'Swedish'
];

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguageSearch, setShowLanguageSearch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Fetch all salons on page load
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/salons`);
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to fetch salons. Please try again.");
        console.error("Error fetching salons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  const handleSearch = async () => {
    const params = new URLSearchParams({
      ...(searchTerm && { query: searchTerm }),
      ...(selectedLanguage && { language: selectedLanguage })
    });
    
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/api/salons/search?${params.toString()}`);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to fetch salons. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageSearch(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setShowLanguageSearch(false);
    setSearchResults(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={`font-sans leading-relaxed min-h-screen transition-colors duration-300
      bg-white dark:bg-gray-900
      text-dark-gray dark:text-gray-200`}>
      
      {/* Header Section */}
      <header className="p-4 bg-gray-100 dark:bg-gray-800 flex justify-between items-center shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <img 
            src={theme === 'light' ? "/public/logo.png" : "/public/logo-dark.png"} 
            alt="VivaHub Logo" 
            className="h-10" 
          />
        </Link>
        
        <div className="hidden md:flex space-x-4">
          <Link to="/filter/hair" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Hair</Link>
          <Link to="/filter/nails" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Nails</Link>
          <Link to="/filter/spa" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Spa</Link>
          <Link to="/filter/makeup" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Makeup</Link>
          <Link to="/filter/facials" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Facials</Link>
          <Link to="/filter/waxing" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Waxing</Link>
          <Link to="/filter/massage" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Massage</Link>
          <Link to="/filter/language" className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors">Language</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="md:hidden relative">
            <button
              onClick={toggleFilters}
              className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink transition-colors"
            >
              <FaFilter size={20} />
            </button>
            {showFilters && (
              <div className="absolute top-10 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                  {['hair', 'nails', 'spa', 'makeup', 'facials', 'waxing', 'massage'].map((service) => (
                    <Link
                      key={service}
                      to={`/filter/${service}`}
                      className="text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink"
                      onClick={() => setShowFilters(false)}
                    >
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-pale-pink dark:hover:bg-dusty-blue transition-colors"
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon className="text-gray-700" /> : <FaSun className="text-gray-200" />}
          </button>
          
          <Link
            to="/login"
            className="px-4 py-2 bg-pale-pink dark:bg-dusty-blue text-gray-700 dark:text-gray-800 rounded-lg text-sm 
                      hover:bg-dusty-blue dark:hover:bg-pale-pink hover:text-white transition-colors"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Hero Section - Fixed background image behavior */}
      <section className="h-[500px] flex bg-none md:bg-[url('/public/background-comb.png')] dark:md:bg-[url('/public/background-comb-dark.png')] bg-cover bg-no-repeat bg-center border-b border-gray-200 dark:border-gray-700">
        <div className="hidden md:flex flex-1"></div>
        <div className="flex-1 flex flex-col justify-center items-start px-5">
          <h1 className="text-3xl font-light mb-4 text-gray-800 dark:text-gray-200">Book Your Perfect Salon Experience</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Discover top-rated salons and book beauty services with ease</p>
          
          <div className="w-full max-w-4xl">
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selectedLanguage ? `Search services in ${selectedLanguage}...` : "Search for services or salons..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg 
                                focus:ring-2 focus:ring-dusty-blue dark:focus:ring-pale-pink focus:border-dusty-blue dark:focus:border-pale-pink
                                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowLanguageSearch(!showLanguageSearch)}
                    className="text-dusty-blue dark:text-pale-pink hover:text-[#91A7B4] dark:hover:text-[#f0c8cc] text-sm flex items-center gap-2"
                  >
                    <FaLanguage />
                    Search by language
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-2 bg-dusty-blue dark:bg-pale-pink text-white dark:text-gray-800 rounded-lg 
                              hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {showLanguageSearch && (
                  <div className="relative mt-2">
                    <input
                      type="text"
                      placeholder="Type to search languages..."
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                focus:ring-2 focus:ring-dusty-blue dark:focus:ring-pale-pink
                                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                    {selectedLanguage && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                        {LANGUAGES.filter(lang => 
                          lang.toLowerCase().includes(selectedLanguage.toLowerCase())
                        ).map(lang => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageSelect(lang)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 text-red-500 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-10 px-5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <img
              src="../../public/coupon.png"
              alt="Discount Coupon"
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Get a Special Discount</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Claim your exclusive discount coupon for your next salon visit.
            </p>
            <Link
              to="/special-offers"
              className="px-6 py-2 bg-dusty-blue dark:bg-pale-pink text-white dark:text-gray-800 rounded-lg 
                        hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
            >
              Claim Now
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <img
              src="../../public/nails1.png"
              alt="Top Rated Salons"
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Top Rated Salons</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Explore the highest-rated salons in your area and book today.
            </p>
            <Link
              to="/filter/top-rated"
              className="px-6 py-2 bg-dusty-blue dark:bg-pale-pink text-white dark:text-gray-800 rounded-lg 
                        hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
            >
              View Salons
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-medium mb-8 text-gray-800 dark:text-gray-200 text-center">
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
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={i < review.rating ? "text-[#dcbd73] dark:text-[#dcbd73]" : "text-gray-300 dark:text-gray-500"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{review.text}"</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">— {review.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 px-5 bg-dusty-blue dark:bg-pale-pink text-white dark:text-gray-800 text-center border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-2xl font-light mb-4">Ready to Book Your Next Appointment?</h2>
        <p className="max-w-2xl mx-auto mb-6 opacity-90">
          Join thousands of satisfied customers using VivaHub
        </p>
        <Link to="/signup">
          <button className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg 
                           hover:bg-pale-pink dark:hover:bg-dusty-blue transition-colors">
            Sign Up Now
          </button>
        </Link>
      </section>

      {/* About the App Section */}
      <section className="py-10 px-5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">Why Choose VivaHub?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            VivaHub is your one-stop platform for discovering and booking top-rated salons. 
            Enjoy seamless booking, exclusive discounts, and access to the best beauty services in your area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="../../public/beauty-salon-pink.png" alt="Feature 1" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Discover Top Salons</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Find the best salons near you with verified reviews and ratings.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="../../public/discount.png" alt="Feature 2" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Exclusive Discounts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enjoy special offers and discounts on your favorite services.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="../../public/computer.png" alt="Feature 3" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Book your appointments in just a few clicks, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Business Owners Section */}
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="text-center md:text-left flex flex-col justify-center">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">Are You a Salon Owner?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join VivaHub and grow your business by reaching thousands of potential customers. 
              Showcase your services, manage bookings, and increase your revenue.
              <br />
              <br />
              <Link
                to="/signup"
                className="px-4 py-2 bg-dusty-blue dark:bg-pale-pink text-white dark:text-gray-800 rounded-lg 
                          hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
              >
                Partner with Us
              </Link>
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="../../public/business-owner1.jpg"
              alt="Business Owner"
              className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </section>

      {/* Social Media Links Section */}
      <section className="py-12 px-5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">Follow Us on Social Media</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Stay updated with the latest news, offers, and beauty tips from VivaHub.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink 
                        transition-colors border border-gray-300 dark:border-gray-600 rounded-full 
                        hover:border-dusty-blue dark:hover:border-pale-pink"
            >
              <FiFacebook size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-700 dark:text-gray-200 hover:text-dusty-blue dark:hover:text-pale-pink 
                        transition-colors border border-gray-300 dark:border-gray-600 rounded-full 
                        hover:border-dusty-blue dark:hover:border-pale-pink"
            >
              <FiInstagram size={22} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-5 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">VivaHub</h3>
            <p className="text-sm text-gray-400">
              Your premier salon booking platform
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-pale-pink">About</a></li>
              <li><a href="#" className="hover:text-pale-pink">Careers</a></li>
              <li><a href="#" className="hover:text-pale-pink">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-pale-pink">Help Center</a></li>
              <li><a href="#" className="hover:text-pale-pink">Blog</a></li>
              <li><a href="#" className="hover:text-pale-pink">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-pale-pink">Privacy</a></li>
              <li><a href="#" className="hover:text-pale-pink">Terms</a></li>
              <li><a href="#" className="hover:text-pale-pink">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-gray-700 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} VivaHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;