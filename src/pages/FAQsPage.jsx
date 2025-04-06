import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const FAQsPage = () => {
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about VivaHub.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* General Questions */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              General Questions
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-4">
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">What is VivaHub?</h3>
              <p>VivaHub is a platform that connects customers with beauty and wellness service providers, making it easy to discover and book appointments.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">Is VivaHub free to use?</h3>
              <p>Yes, creating an account and searching for services is completely free. We only charge a small booking fee when you make an appointment.</p>
            </div>
          </div>
        </section>

        {/* Booking Questions */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Booking Questions
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-4">
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">How do I book an appointment?</h3>
              <p>Simply search for the service you want, select a salon, choose your preferred time, and complete the booking process.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">Can I cancel or reschedule my booking?</h3>
              <p>Yes, you can cancel or reschedule up to 24 hours before your appointment. Check your booking confirmation for details.</p>
            </div>
          </div>
        </section>

        {/* Payment Questions */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Payment Questions
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          
          <div className="space-y-4">
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
              <p>We accept all major credit cards, PayPal, and Apple Pay. Some salons may also accept cash payments in person.</p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"}`}>
              <h3 className="text-xl font-semibold mb-2">When am I charged for my booking?</h3>
              <p>For most services, you'll be charged a small booking fee when you make the appointment, with the remaining balance paid directly to the salon.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};