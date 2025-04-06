import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const ClaimOfferPage = () => {
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
        className={`py-16 text-center bg-gradient-to-r ${
          theme === "light"
            ? "from-[#F8F8F8] to-[#F0F7FF]"
            : "from-gray-800 to-gray-900"
        }`}
      >
        <h1 className="text-5xl font-heading font-bold mb-4">Your Special Offer</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed">
          Enjoy a personalized beauty experience — at a discounted price!
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-lg leading-relaxed">
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">🎉 Here’s what you get:</h2>
          <ul className="list-disc list-inside text-left mx-auto max-w-xl space-y-2">
            <li>15% off your next booking at any participating salon</li>
            <li>Valid for all services including hair, nails, and spa</li>
            <li>Instant confirmation and easy redemption</li>
          </ul>
        </section>

        <section className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4 text-center">
          <h3 className="text-xl font-semibold">Your Coupon Code:</h3>
          <div className="text-3xl font-bold tracking-wide text-[#f927ac] dark:text-pink-400">
            VIVA15OFF
          </div>
          <p>Use this code at checkout to redeem your discount.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            *Offer valid for a limited time only. One-time use per customer.
          </p>
        </section>

      </div>

      <Footer />
    </div>
  );
};
