import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const HelpCenterPage = () => {
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
            Help Center
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Find answers to your questions about VivaHub.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Search */}
        <section className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles..."
              className={`w-full p-4 rounded-xl border ${
                theme === "light"
                  ? "border-gray-300 bg-white"
                  : "border-gray-700 bg-gray-800"
              }`}
            />
            <button className="absolute right-4 top-4 text-[#A2B9C6]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Popular Topics
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#A2B9C6] hover:underline">How to create an account</a></li>
                <li><a href="#" className="text-[#A2B9C6] hover:underline">Booking your first appointment</a></li>
              </ul>
            </div>
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-3">Account Settings</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#A2B9C6] hover:underline">Updating your profile</a></li>
                <li><a href="#" className="text-[#A2B9C6] hover:underline">Changing your password</a></li>
              </ul>
            </div>
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-3">Payments</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#A2B9C6] hover:underline">Accepted payment methods</a></li>
                <li><a href="#" className="text-[#A2B9C6] hover:underline">Understanding charges</a></li>
              </ul>
            </div>
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-3">Cancellations</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#A2B9C6] hover:underline">How to cancel a booking</a></li>
                <li><a href="#" className="text-[#A2B9C6] hover:underline">Refund policy</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Still Need Help?
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className={`p-8 rounded-xl text-center ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
            <p className="mb-6">Our support team is here to help you.</p>
            <button className="px-6 py-3 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#8fa9b8] transition-colors">
              Contact Support
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};