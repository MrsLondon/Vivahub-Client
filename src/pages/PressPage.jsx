import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const PressPage = () => {
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
            Press Center
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Latest news and media resources about VivaHub.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Press Releases */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Press Releases
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">VivaHub Raises $10M in Series A Funding</h3>
              <p className="mb-4 text-sm">March 15, 2024</p>
              <p>VivaHub has secured $10 million in Series A funding to expand its salon booking platform across Europe.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">VivaHub Launches in 5 New Countries</h3>
              <p className="mb-4 text-sm">January 5, 2024</p>
              <p>The platform is now available in France, Germany, Spain, Italy, and the Netherlands.</p>
            </div>
          </div>
        </section>

        {/* Media Resources */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Media Resources
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"} p-8 rounded-xl`}>
            <div>
              <h3 className="text-xl font-semibold mb-3">Brand Assets</h3>
              <p className="mb-4">Download our logo and brand guidelines:</p>
              <button className="px-4 py-2 bg-[#A2B9C6] text-white rounded hover:bg-[#8fa9b8] transition-colors">
                Download Press Kit
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Press Contact</h3>
              <p>For media inquiries, please contact:</p>
              <p className="mt-2 font-medium">press@vivahub.com</p>
              <p>+44 20 1234 5678</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};