import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const PrivacyPolicyPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 ${theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="py-16 text-center bg-gradient-to-r from-[#F8F8F8] to-[#F0F7FF] dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-5xl font-heading font-bold mb-6">Privacy Policy</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed">Your privacy is important to us. Here's how we handle your data.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Data Collection</h2>
          <p>We collect information you provide when creating an account or booking services, including name, contact details, and preferences.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Usage</h2>
          <p>Your data is used to personalize your experience, manage appointments, and improve our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Third Parties</h2>
          <p>We do not sell your data. We may share it with trusted partners solely for delivering our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
          <p>We implement appropriate measures to safeguard your personal information from unauthorized access.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;