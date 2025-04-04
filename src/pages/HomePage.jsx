import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SpecialOffers from "../components/SpecialOffers";
import Testimonials from "../components/Testimonials";
import CallToAction from '../components/CallToAction';
import AboutApp from "../components/AboutApp";
import ForBusinessOwners from "../components/ForBusinessOwners";
import SocialMedia from '../components/SocialMedia';
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguageSearch, setShowLanguageSearch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

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
      
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        showFilters={showFilters} 
        toggleFilters={toggleFilters} 
      />
      
      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
        clearSearch={clearSearch}
        showLanguageSearch={showLanguageSearch}
        setShowLanguageSearch={setShowLanguageSearch}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languages={languages}
      />
      
      <SpecialOffers />
      
      <Testimonials />
      
      <CallToAction />
      
      <AboutApp />
      
      <ForBusinessOwners />
      
      <SocialMedia />
      
      <Footer />
    </div>
  );
};

export default Homepage;