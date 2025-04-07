import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaSearch, FaTimes, FaLanguage } from "react-icons/fa";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Initialize state from URL params
  const searchParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [showLanguageSearch, setShowLanguageSearch] = useState(false);
  const [languages, setLanguages] = useState([]);
  const dropdownRef = useRef(null);

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

  // Watch for URL changes and update state
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

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        filterType: selectedLanguage ? 'language' : 'service',
        ...(searchTerm && { query: searchTerm }),
        ...(selectedLanguage && { language: selectedLanguage })
      });

      // Only update URL if it's different from current
      if (params.toString() !== new URLSearchParams(location.search).toString()) {
        navigate(`/search?${params.toString()}`, { replace: true });
      }

      const response = await axios.get(`${API_URL}/api/search`, { params });
      
      if (response.data.status === 'success') {
        setSearchResults(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedLanguage, navigate, location.search]);

  // Trigger search when relevant values change
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "light" ? "bg-gray-50" : "bg-gray-900"
    }`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className={`p-4 rounded-lg shadow-sm ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
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

            {/* Language Search Link */}
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

            {/* Language Search Dropdown */}
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

        {/* Error Message */}
        {error && (
          <div className={`mt-6 p-3 rounded-md ${
            theme === "light" 
              ? "bg-red-100 text-red-700" 
              : "bg-red-900 text-red-200"
          }`}>
            {error}
          </div>
        )}

        {/* Search Results */}
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
              <span className={`text-sm ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}>
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-10">
                <p className={theme === "light" ? "text-gray-500" : "text-gray-300"}>
                  No results found for your search.
                </p>
                <p className={`mt-2 ${
                  theme === "light" ? "text-gray-500" : "text-gray-300"
                }`}>
                  Try different keywords or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/salons/${result._id}`}
                    className={`block border rounded-lg overflow-hidden hover:shadow-md transition duration-300 ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    <div className="h-40 bg-gray-200 relative">
                      <img
                        src={result.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className={`font-semibold text-lg mb-1 ${
                        theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                      }`}>
                        {result.name}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {result.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          theme === "light" ? "text-[#A2B9C6]" : "text-[#FADADD]"
                        }`}>
                          {result.services?.length || 0} services
                        </span>
                        <span className={`text-sm ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {result.languages?.join(', ') || 'English'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;