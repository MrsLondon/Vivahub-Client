import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaSearch, FaTimes, FaLanguage } from "react-icons/fa";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Salon placeholder mapping utility
const salonPlaceholders = {
  "Elegant Beauty Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308274/vivahub_services_placeholders/elegant-beauty-salon-placeholder.png",
  "Modern Style Studio": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308340/vivahub_services_placeholders/modern-style-studio-placeholder.png",
  "Glamour & Glow Beauty Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308339/vivahub_services_placeholders/glamour-glow-beauty-salon-placeholder.png",
  "Sergi's Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744310237/vivahub_services_placeholders/sergis-salon-placeholder.png",
  "Brunella Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308341/vivahub_services_placeholders/brunella-salon-placeholder.png"
};

const GENERIC_SALON_PLACEHOLDER = "https://res.cloudinary.com/duu9km8ss/image/upload/v1744311894/vivahub_services_placeholders/general-salon-placeholder2.png";

// Service placeholder mapping utility
const servicePlaceholders = {
  "women's haircut": "women-haircut-placeholder2",
  "styling": "haircut-and-styling-placeholder",
  "men's haircut": "men-haircut-placeholder",
  "children's haircut": "children-haircut-placeholder",
  "barber": "barber-haircut-placeholder",
  "hair coloring": "hair-coloring-haircut-placeholder",
  "hair extensions": "hair-extensions-placeholder",
  "keratin treatment": "keratin-treatment-placeholder",
  "hair mask": "hair-mask-treatment-placeholder",
  "waxing": "waxing-service-placeholder",
  "makeup": "makeup-placeholder",
  "nails": "nails-placeholder",
  "gel": "gel-nails-placeholder",
  "massage": "massage-placeholder",
  "full body": "full-body-placeholder"
};

const getServicePlaceholder = (serviceName) => {
  const lowerName = serviceName.toLowerCase();
  for (const [key, value] of Object.entries(servicePlaceholders)) {
    if (lowerName.includes(key.toLowerCase())) {
      return `https://res.cloudinary.com/duu9km8ss/image/upload/v1744136286/vivahub_services_placeholders/${value}.jpg`;
    }
  }
  return null;
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [showLanguageSearch, setShowLanguageSearch] = useState(false);
  const [languages, setLanguages] = useState([]);
  const dropdownRef = useRef(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

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

  // Watch for URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSearchTerm = params.get('query') || '';
    const newSelectedLanguage = params.get('language') || '';
    
    if (newSearchTerm !== searchTerm) {
      setSearchTerm(newSearchTerm);
    }
    if (newSelectedLanguage !== selectedLanguage) {
      setSelectedLanguage(newSelectedLanguage);
    }
  }, [location.search]);

  const handleSearch = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      // Get the language code if a language name is selected
      let languageCode = selectedLanguage;
      if (selectedLanguage && !selectedLanguage.includes('-')) {
        // If user entered a language name instead of code, try to find the code
        const foundLanguage = languages.find(
          lang => lang.name.toLowerCase() === selectedLanguage.toLowerCase()
        );
        if (foundLanguage) {
          languageCode = foundLanguage.code;
        }
      }
      
      const params = {
        ...(searchTerm && { query: searchTerm }),
        filterType: languageCode ? 'language' : 'service',
        ...(languageCode && { language: languageCode }),
        page,
        limit: pagination.limit
      };
  
      const response = await axios.get(`${API_URL}/api/search`, { params });
      
      if (response.data.status === 'success') {
        console.log('Search results:', response.data.data);
        setSearchResults(response.data.data);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedLanguage, pagination.limit, languages]);

  useEffect(() => {
    if (searchTerm || selectedLanguage) {
      handleSearch();
    }
  }, [handleSearch, searchTerm, selectedLanguage, location.search]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setShowLanguageSearch(false);
    setSearchResults(null);
    navigate('/search');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageSearch(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ServiceImageCard = ({ service, theme }) => {
    // First try to get the salon image
    let imageUrl = null;
    
    if (service.salon) {
      // Priority: 1. salon.images[0] → 2. specific salon placeholder → 3. service placeholder → 4. generic placeholder
      imageUrl = service.salon.images?.[0] || 
                 (service.salon.name && salonPlaceholders[service.salon.name]) || 
                 getServicePlaceholder(service.name) || 
                 GENERIC_SALON_PLACEHOLDER;
    } else {
      // If no salon, use service image or placeholder
      imageUrl = service.image || getServicePlaceholder(service.name) || GENERIC_SALON_PLACEHOLDER;
    }
    
    return (
      <div className="h-40 bg-gray-200 relative">
        <img
          src={imageUrl}
          alt={service.salon?.name || service.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = GENERIC_SALON_PLACEHOLDER; // Ultimate fallback
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
        
        {service.salon && (
          <div className={`absolute bottom-0 left-0 right-0 p-2 ${
            theme === "light" ? "bg-white/80" : "bg-gray-800/80"
          }`}>
            <p className={`text-sm truncate ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}>
              {service.salon.name}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-gray-50" : "bg-gray-900"
    }`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className={`p-4 rounded-lg shadow-sm ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder={selectedLanguage ? `Search services in ${selectedLanguage}...` : "Search for services or salons..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:ring-2 ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-gray-800"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] focus:border-[#FADADD] text-gray-200"
                  }`}
                />
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "light" ? "text-gray-400" : "text-gray-300"
                }`} />
                {(searchTerm || selectedLanguage) && (
                  <button
                    onClick={clearSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-300 hover:text-gray-100"
                    }`}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowLanguageSearch(!showLanguageSearch)}
                className={`text-sm flex items-center gap-2 ${
                  theme === "light" 
                    ? "text-[#A2B9C6] hover:text-[#91A7B4]" 
                    : "text-[#FADADD] hover:text-[#f0c8cc]"
                }`}
              >
                <FaLanguage />
                Search by language
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`px-6 py-2 rounded-lg transition duration-300 ${
                  theme === "light"
                    ? "bg-[#A2B9C6] text-white hover:bg-[#91A7B4]"
                    : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {showLanguageSearch && (
              <div className="relative mt-2" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Type to search languages..."
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`w-full p-2 border rounded-md focus:ring-2 ${
                    theme === "light"
                      ? "border-gray-300 focus:ring-[#A2B9C6] text-gray-800"
                      : "border-gray-600 bg-gray-700 focus:ring-[#FADADD] text-gray-200"
                  }`}
                />
                {selectedLanguage && (
                  <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto ${
                    theme === "light"
                      ? "bg-white border-gray-300"
                      : "bg-gray-800 border-gray-600"
                  }`}>
                    {languages.filter(lang => 
                      lang.name.toLowerCase().includes(selectedLanguage.toLowerCase())
                    ).map(lang => (
                      <button
                        key={lang.code}
                        className={`w-full px-4 py-2 text-left flex items-center ${
                          theme === "light"
                            ? "hover:bg-gray-100"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguageSearch(false);
                        }}
                      >
                        <img 
                          src={`https://flagcdn.com/w20/${lang.country}.png`}
                          alt={lang.name}
                          className="w-5 h-4 mr-2"
                        />
                        <span className={theme === "light" ? "text-gray-800" : "text-gray-200"}>
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className={`mt-6 p-3 rounded-md ${
            theme === "light" 
              ? "bg-red-100 text-red-700" 
              : "bg-red-900 text-red-200"
          }`}>
            {error}
          </div>
        )}

        {searchResults && (
          <div className={`mt-6 rounded-lg shadow-sm p-6 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${
                theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
              }`}>
                Search Results
              </h2>
              {searchResults.length > 0 && (
                <span className={`text-sm ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}>
                  Showing {searchResults.length} results
                </span>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-10">
                <p className={theme === "light" ? "text-gray-500" : "text-gray-300"}>
                  No results found for your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((service) => (
                  <Link
                    key={service._id}
                    to={`/salons/${service.salon._id}`}
                    className={`block border rounded-lg overflow-hidden hover:shadow-md transition duration-300 ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    <ServiceImageCard service={service} theme={theme} />
                    <div className="p-4">
                      <h3 className={`font-semibold text-lg mb-1 ${
                        theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                      }`}>
                        {service.name}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {service.description?.substring(0, 60)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          theme === "light" ? "text-[#A2B9C6]" : "text-[#FADADD]"
                        }`}>
                          ${service.price} • {service.duration} mins
                        </span>
                        <span className={`text-sm ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {service.languageDetails && service.languageDetails.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              {service.languageDetails.map((lang, index) => (
                                <img 
                                  key={index}
                                  src={`https://flagcdn.com/w20/${lang.country}.png`}
                                  alt={lang.name}
                                  title={lang.name}
                                  className="w-5 h-4 inline-block"
                                />
                              ))}
                            </div>
                          ) : service.languageSpoken ? (
                            Array.isArray(service.languageSpoken) ? (
                              <div className="flex items-center space-x-1">
                                {service.languageSpoken.map((code, index) => {
                                  const lang = languages.find(l => l.code === code) || 
                                              { code, name: code, country: 'xx' };
                                  return (
                                    <img 
                                      key={index}
                                      src={`https://flagcdn.com/w20/${lang.country}.png`}
                                      alt={lang.name}
                                      title={lang.name}
                                      className="w-5 h-4 inline-block"
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              (() => {
                                const lang = languages.find(l => l.code === service.languageSpoken) || 
                                          { code: service.languageSpoken, name: service.languageSpoken, country: 'xx' };
                                return (
                                  <img 
                                    src={`https://flagcdn.com/w20/${lang.country}.png`}
                                    alt={lang.name}
                                    title={lang.name}
                                    className="w-5 h-4 inline-block"
                                  />
                                );
                              })()
                            )
                          ) : (
                            'English'
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className={`flex justify-center mt-6 space-x-2 ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}>
            <button
              onClick={() => handleSearch(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-4 py-2 rounded-md ${
                pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handleSearch(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`px-4 py-2 rounded-md ${
                pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;