import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const TermsOfServicePage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 ${theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="py-16 text-center bg-gradient-to-r from-[#F8F8F8] to-[#F0F7FF] dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-5xl font-heading font-bold mb-6">Terms of Service</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed">Understand the rules and expectations for using VivaHub.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance</h2>
          <p>By using our platform, you agree to abide by our terms and any applicable laws and regulations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Bookings</h2>
          <p>Users are responsible for attending appointments and cancelling in advance when necessary. No-shows may result in restrictions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Account</h2>
          <p>You must keep your login information secure. We reserve the right to suspend accounts for suspicious activity.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Modifications</h2>
          <p>We may update these terms as needed. Continued use of the platform indicates your acceptance of any changes.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
};


