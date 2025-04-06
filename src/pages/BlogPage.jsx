import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const BlogPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen font-body transition-colors duration-300 ${
        theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"
      }`}
    >
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <div
        className={`py-16 ${
          theme === "light"
            ? "bg-gradient-to-r from-[#F8F8F8] to-[#F0F7FF]"
            : "bg-gradient-to-r from-gray-800 to-gray-900"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-heading font-bold mb-6 animate-fade-in">
            VivaHub Blog
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Beauty tips, industry news, and platform updates.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Featured Post */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Featured Post
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className={`rounded-xl overflow-hidden shadow-md ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Beauty trends" 
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-3">Top 5 Beauty Trends for 2024</h3>
              <p className="mb-4 text-sm">March 28, 2024 • 5 min read</p>
              <p className="mb-6">Discover the hottest beauty trends that are taking the industry by storm this year.</p>
              <a href="#" className="text-[#A2B9C6] font-medium hover:underline">Read More</a>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Recent Posts
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`rounded-xl overflow-hidden shadow-md ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <img 
                src="https://images.unsplash.com/photo-1596704017256-8eef1a9e7e1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Hair care" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Essential Hair Care Tips</h3>
                <p className="mb-4 text-sm">March 15, 2024 • 4 min read</p>
                <a href="#" className="text-[#A2B9C6] hover:underline">Read More</a>
              </div>
            </div>
            
            <div className={`rounded-xl overflow-hidden shadow-md ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Nail art" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Spring Nail Art Ideas</h3>
                <p className="mb-4 text-sm">March 5, 2024 • 3 min read</p>
                <a href="#" className="text-[#A2B9C6] hover:underline">Read More</a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Stay Updated
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className={`p-8 rounded-xl text-center ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
            <p className="mb-6">Subscribe to our newsletter for the latest beauty tips and VivaHub updates.</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className={`flex-grow p-3 rounded-l border ${
                  theme === "light"
                    ? "border-gray-300 bg-white"
                    : "border-gray-700 bg-gray-800"
                }`}
              />
              <button className="px-6 py-3 bg-[#A2B9C6] text-white rounded-r hover:bg-[#8fa9b8] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};