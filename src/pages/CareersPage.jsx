import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const CareersPage = () => {
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
            Join Our Team
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Help us revolutionize the beauty and wellness industry.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Open Positions */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Open Positions
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">Frontend Developer Junior</h3>
              <p className="mb-4">Full-time • Remote</p>
              <p>We're looking for a skilled React developer to help build our booking platform.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">UX Designer</h3>
              <p className="mb-4">Full-time • Hybrid (London)</p>
              <p>Help us create beautiful, intuitive experiences for our users.</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Our Benefits
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"} p-8 rounded-xl`}>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Everyone</h3>
              <ul className="space-y-2">
                <li>• Competitive salary</li>
                <li>• Flexible working hours</li>
                <li>• Remote work options</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Office Workers</h3>
              <ul className="space-y-2">
                <li>• Free salon services</li>
                <li>• Wellness programs</li>
                <li>• Team retreats</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CareersPage;