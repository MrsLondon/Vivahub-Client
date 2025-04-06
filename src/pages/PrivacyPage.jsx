import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const PrivacyPage = () => {
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
            Privacy Policy
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Last updated: March 1, 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">VivaHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us when you register, make bookings, or interact with our services, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact information (name, email, phone number)</li>
              <li>Payment information</li>
              <li>Booking history and preferences</li>
              <li>Device and usage data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send confirmations</li>
              <li>Improve user experience</li>
              <li>Communicate with you about bookings and promotions</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Sharing of Information</h2>
            <p className="mb-4">We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers to facilitate our services</li>
              <li>Salons you book with to fulfill your appointments</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page.</p>
          </section>
        </div>
      </div>

        <Footer />
    </div>
  );
}
export default PrivacyPage;