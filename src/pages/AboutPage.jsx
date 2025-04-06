import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

export const AboutPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen font-body transition-colors duration-300 ${
        theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"
      }`}
    >
      {/* Header */}
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
            About VivaHub
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Revolutionizing the beauty and wellness industry, one booking at a time.
          </p>
        </div>
      </div>

      <br />

{/* Meet the Team */}
<section className="space-y-6 px-6 lg:px-16">
  <div className="text-center">
    <h2 className="text-3xl font-heading font-semibold mb-2">
      Meet the Team
    </h2>
    <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Ayat */}
    <div
      className={`team-member text-center p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${
        theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
      }`}
    >
      <img
        src="https://media.licdn.com/dms/image/v2/D4E03AQEP5OsMXuWpkw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1709658189251?e=1749081600&v=beta&t=q44lnW3WTZY6WHyYzo3hGPXqJF7Ni3x120P7kXJVP18"
        alt="Ayat Abu Haj"
        className={`w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 ${
          theme === "light" ? "border-[#F8F8F8]" : "border-gray-700"
        }`}
      />
      <h3 className="text-xl font-semibold mb-2">Ayat</h3>
      <div className="flex justify-center space-x-4">
        <a
          href="https://www.linkedin.com/in/ayatabuhaj/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A2B9C6] hover:text-[#4A4A4A] dark:hover:text-gray-300 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/MrsLondon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A2B9C6] hover:text-[#4A4A4A] dark:hover:text-gray-300 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>

    {/* Brunella */}
    <div
      className={`team-member text-center p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${
        theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
      }`}
    >
      <img
        src="https://media.licdn.com/dms/image/v2/D4D03AQG9815cCiJCHw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1670249089945?e=1749081600&v=beta&t=sSNystgLofGCOI2r0SfGFjj9kvZia71Zv6N8vtBH6fw"
        alt="Brunella Carvalho"
        className={`w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 ${
          theme === "light" ? "border-[#F8F8F8]" : "border-gray-700"
        }`}
      />
      <h3 className="text-xl font-semibold mb-2">Brunella</h3>
      <div className="flex justify-center space-x-4">
        <a
          href="https://www.linkedin.com/in/brunella-nmcarvalho/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A2B9C6] hover:text-[#4A4A4A] dark:hover:text-gray-300 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/brunellanmcarvalho1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A2B9C6] hover:text-[#4A4A4A] dark:hover:text-gray-300 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>

    {/* Victor */}
    <div
      className={`team-member text-center p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${
        theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
      }`}
    >
      <img
        src="https://media.licdn.com/dms/image/v2/C4D03AQH274eJuRkpsQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1616875014389?e=1749081600&v=beta&t=9vhxLyPmvC5Fq4hPiS_ZlgRmXxjB9rH58EiDRG9wbKQ"
        alt="Victor Marchesi"
        className={`w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 ${
          theme === "light" ? "border-[#F8F8F8]" : "border-gray-700"
        }`}
      />
      <h3 className="text-xl font-semibold mb-2">Victor</h3>
      <div className="flex justify-center space-x-4">
        <a
          href="https://www.linkedin.com/in/victor-marchesi/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A2B9C6] hover:text-[#4A4A4A] dark:hover:text-gray-300 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/vicmarchesi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A2B9C6] hover:text-[#4A4A4A] dark:hover:text-gray-300 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</section>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Our Story */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              VivaHub is your premier salon booking platform, designed to connect customers with top-rated salons and beauty services. Our mission is to make booking beauty services seamless, efficient, and enjoyable for everyone.
            </p>
            <p>
              Whether you're looking for a haircut, manicure, spa treatment, or makeup services, VivaHub provides a wide range of options to suit your needs. With our user-friendly platform, you can explore services, compare prices, and book appointments with just a few clicks.
            </p>
            <p>
              We are committed to empowering both customers and salon owners by providing a platform that fosters trust, transparency, and convenience. Join us on our journey to revolutionize the beauty industry!
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-semibold mb-2">
              Our Vision & Mission
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
          </div>
          <div
            className={`rounded-xl p-8 space-y-6 ${
              theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
            }`}
          >
            <div>
              <h3 className="text-xl font-semibold mb-3">Vision</h3>
              <p className="text-lg leading-relaxed">
                To be the go-to platform for beauty and wellness services, creating a seamless connection between customers and service providers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Mission</h3>
              <p className="text-lg leading-relaxed">
                To simplify the process of discovering and booking beauty services while empowering salon owners to grow their businesses.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};