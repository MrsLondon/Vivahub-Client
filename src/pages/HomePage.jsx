import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaSearch, FaTimes, FaLanguage, FaFilter } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


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

  // Fetch all salons on page load
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/salons`);
        setSearchResults(response.data); // Store salons in state
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

  // Trigger search on pressing Enter
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

  // Toggle filter dropdown for mobile view
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen">
      {/* Header Section */}
      <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
        <Link to="/" className="flex items-center">
          <img src="/public/logo.png" alt="VivaHub Logo" className="h-10" />
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link to="/filter/hair" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Hair</Link>
          <Link to="/filter/nails" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Nails</Link>
          <Link to="/filter/spa" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Spa</Link>
          <Link to="/filter/makeup" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Makeup</Link>
          <Link to="/filter/facials" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Facials</Link>
          <Link to="/filter/waxing" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Waxing</Link>
          <Link to="/filter/massage" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Massage</Link>
          <Link to="/filter/language" className="text-[#4A4A4A] hover:text-[#A2B9C6]">Language</Link>
        </div>
        <div className="md:hidden relative">
          <button
            onClick={toggleFilters}
            className="text-[#4A4A4A] hover:text-[#A2B9C6] transition duration-300"
          >
            <FaFilter size={20} />
          </button>
          {showFilters && (
            <div className="absolute top-10 right-0 w-48 bg-white shadow-lg z-10 p-4 rounded-lg">
              <div className="flex flex-col space-y-2">
                <Link to="/filter/hair" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Hair</Link>
                <Link to="/filter/nails" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Nails</Link>
                <Link to="/filter/spa" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Spa</Link>
                <Link to="/filter/makeup" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Makeup</Link>
                <Link to="/filter/facials" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Facials</Link>
                <Link to="/filter/waxing" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Waxing</Link>
                <Link to="/filter/massage" className="text-[#4A4A4A] hover:text-[#A2B9C6]" onClick={() => setShowFilters(false)}>Massage</Link>
              </div>
            </div>
          )}
        </div>
        <Link
          to="/login"
          className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
        >
          Log In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="h-[500px] bg-cover bg-no-repeat bg-center bg-contain bg-left flex bg-none md:bg-[url('/public/background-comb.png')]">
        <div className="hidden md:flex flex-1"></div>
        <div className="flex-1 flex flex-col justify-center items-start px-5">
          <h1 className="text-3xl font-light mb-4 text-[#4A4A4A]">Book Your Perfect Salon Experience</h1>
          <p className="text-[#4A4A4A]/80 mb-8">Discover top-rated salons and book beauty services with ease</p>
          
          <div className="w-full max-w-4xl">
            {/* Search Section */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={selectedLanguage ? `Search services in ${selectedLanguage}...` : "Search for services or salons..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    {(searchTerm || selectedLanguage) && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    className="text-[#A2B9C6] hover:text-[#91A7B4] text-sm flex items-center gap-2"
                  >
                    <FaLanguage />
                    Search by language
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-2 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#91A7B4] transition duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A2B9C6] focus:border-[#A2B9C6]"
                    />
                    {selectedLanguage && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {LANGUAGES.filter(lang => 
                          lang.toLowerCase().includes(selectedLanguage.toLowerCase())
                        ).map(lang => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageSelect(lang)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
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
            <div className="mt-3 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Featured Salons Section */}
      {/* <section className="py-10 px-5 bg-[#F8F8F8]"> 
        <h2 className="text-xl font-medium mb-6 text-[#4A4A4A] text-center">
          {searchResults ? "Search Results" : "Featured Salons"}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {searchResults ? (
            searchResults.length > 0 ? (
              searchResults.map((salon) => (
                <Link
                  to={`/salon/${salon._id}`} 
                  key={salon._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-[#E0E0E0]"
                >
                  <img
                    src={salon.image || "https://via.placeholder.com/400x300"}
                    alt={salon.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1 text-[#4A4A4A]">
                      {salon.name}
                    </h3>
                    <p className="text-sm text-[#4A4A4A]/80 mb-3">
                      {salon.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#4A4A4A]">
                        {salon.location}
                      </span>
                      <button className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No salons found matching your search. Try different keywords.
              </div>
            )
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
      </section> */}

      {/* Special Offers Section */}
<section className="py-10 px-5 bg-[#F8F8F8]">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
    <img
        src="../../public/coupon.png"
        alt="Discount Coupon"
        className="mx-auto mb-4 w-48 h-48 object-contain"
      />
      <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Get a Special Discount</h3>
      <p className="text-sm text-[#4A4A4A]/80 mb-4">
        Claim your exclusive discount coupon for your next salon visit.
      </p>
      <Link
        to="/special-offers"
        className="px-6 py-2 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#91A7B4] transition duration-300"
      >
        Claim Now
      </Link>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
    <img
      src="../../public/nails1.png"
      alt="Top Rated Salons"
      className="mx-auto mb-4 w-48 h-48 object-contain"
      />
      <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Top Rated Salons</h3>
      <p className="text-sm text-[#4A4A4A]/80 mb-4">
        Explore the highest-rated salons in your area and book today.
      </p>
      <Link
        to="/filter/top-rated"
        className="px-6 py-2 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#91A7B4] transition duration-300"
      >
        View Salons
      </Link>
    </div>
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

      {/* Call-to-Action Section */}
      <section className="py-12 px-5 bg-[#A2B9C6] text-white text-center">
        <h2 className="text-2xl font-light mb-4">Ready to Book Your Next Appointment?</h2>
        <p className="max-w-2xl mx-auto mb-6 opacity-90">
          Join thousands of satisfied customers using VivaHub
        </p>
        <Link to="/signup">
          <button className="px-6 py-3 bg-white text-[#4A4A4A] rounded-lg hover:bg-[#FADADD] transition duration-300">
            Sign Up Now
          </button>
        </Link>
      </section>

      {/* About the App Section */}
<section className="py-10 px-5 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Why Choose VivaHub?</h2>
    <p className="text-[#4A4A4A]/80 mb-8">
      VivaHub is your one-stop platform for discovering and booking top-rated salons. 
      Enjoy seamless booking, exclusive discounts, and access to the best beauty services in your area.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#F8F8F8] p-6 rounded-lg shadow-sm">
        <img src="../../public/beauty-salon-pink.png" alt="Feature 1" className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Discover Top Salons</h3>
        <p className="text-sm text-[#4A4A4A]/80">
          Find the best salons near you with verified reviews and ratings.
        </p>
      </div>
      <div className="bg-[#F8F8F8] p-6 rounded-lg shadow-sm">
        <img src="../../public/discount.png" alt="Feature 2" className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Exclusive Discounts</h3>
        <p className="text-sm text-[#4A4A4A]/80">
          Enjoy special offers and discounts on your favorite services.
        </p>
      </div>
      <div className="bg-[#F8F8F8] p-6 rounded-lg shadow-sm">
        <img src="../../public/computer.png" alt="Feature 3" className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Easy Booking</h3>
        <p className="text-sm text-[#4A4A4A]/80">
          Book your appointments in just a few clicks, anytime, anywhere.
        </p>
      </div>
    </div>
  </div>
</section>

{/* For Business Owners Section */}
<section className="py-10 px-5 bg-white">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
    {/* Left Side: Text Content */}
    <div className="text-center md:text-left flex flex-col justify-center">
      <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Are You a Salon Owner?</h2>
      <p className="text-[#4A4A4A]/80 mb-8">
        Join VivaHub and grow your business by reaching thousands of potential customers. 
        Showcase your services, manage bookings, and increase your revenue.
        <br />
        <br />
        <Link
        to="/signup"
        className="px-4 py-2 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#91A7B4] transition duration-300"
      >
        Partner with Us
      </Link>
      </p>
     
    </div>

    {/* Right Side: Regular Image */}
    <div className="flex justify-center">
      <img
        src="../../public/business-owner1.jpg"
        alt="Business Owner"
        className="w-full max-w-sm rounded-lg"
      />
    </div>
  </div>
</section>

{/* Social Media Links Section */}
<section className="py-10 px-5 bg-[#F8F8F8]">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Follow Us on Social Media</h2>
    <p className="text-[#4A4A4A]/80 mb-8">
      Stay updated with the latest news, offers, and beauty tips from VivaHub.
    </p>
    <div className="flex justify-center space-x-6">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-[#4267B2] text-white rounded-full hover:bg-[#365899] transition duration-300"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full hover:opacity-90 transition duration-300"
      >
        <FaInstagram size={20} />
      </a>
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-[#1DA1F2] text-white rounded-full hover:bg-[#0d95e8] transition duration-300"
      >
        <FaTwitter size={20} />
      </a>

    </div>
  </div>
</section>

      {/* Footer Section */}
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