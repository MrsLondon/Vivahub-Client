import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const CookiePolicyPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 ${theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="py-16 text-center bg-gradient-to-r from-[#F8F8F8] to-[#F0F7FF] dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-5xl font-heading font-bold mb-6">Cookie Policy</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed">Here’s how we use cookies to enhance your experience.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device to help websites remember information about your visit.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Them</h2>
          <p>We use cookies for authentication, analytics, and personalizing content and ads to improve your experience.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
          <p>You can adjust your browser settings to refuse cookies or alert you when they are being used. However, this may impact site functionality.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
};
