import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaSearch, FaTimes, FaLanguage, FaUser } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [showLanguageSearch, setShowLanguageSearch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [languages, setLanguages] = useState([]);

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

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        filterType: selectedLanguage ? 'language' : 'service',
        ...(searchTerm && { query: searchTerm }),
        ...(selectedLanguage && { language: selectedLanguage })
      });

      // Update URL with search parameters
      navigate(`/search?${params.toString()}`, { replace: true });

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
  }, [searchTerm, selectedLanguage, navigate]);

  useEffect(() => {
    if (searchTerm || selectedLanguage) {
      handleSearch();
    }
  }, [handleSearch, searchTerm, selectedLanguage]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
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
                className={`px-6 py-2 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#91A7B4] transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
                    {languages.filter(lang => 
                      lang.name.toLowerCase().includes(selectedLanguage.toLowerCase())
                    ).map(lang => (
                      <button
                        key={lang.code}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          handleSearch();
                        }}
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

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#4A4A4A]">Search Results</h2>
              <span className="text-sm text-gray-500">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No results found for your search.</p>
                <p className="text-gray-500 mt-2">Try different keywords or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/salon/${result._id}`}
                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300"
                  >
                    <div className="h-40 bg-gray-200 relative">
                      <img
                        src={result.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-[#4A4A4A] mb-1">{result.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{result.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#A2B9C6]">
                          {result.services?.length || 0} services
                        </span>
                        <span className="text-sm text-gray-500">
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
