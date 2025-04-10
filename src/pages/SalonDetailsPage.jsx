import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FaSlidersH, FaMoon, FaSun } from "react-icons/fa";
import StarRating from "../components/StarRating";
import ReviewItem from "../components/ReviewItem";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";
import { BookingContext } from "../context/BookingContext";
import BookingSidebar from "../components/BookingSidebar";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

// Create axios instance with default config
const API_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const SalonDetailsPage = () => {
  const { salonId } = useParams();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingSidebarOpen, setIsBookingSidebarOpen] = useState(false);
  const { addToBooking, bookingCount } = useContext(BookingContext);
  const { user, isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { theme, toggleTheme } = useTheme();

// Salon placeholder mapping utility
const salonPlaceholders = {
  "Elegant Beauty Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308274/vivahub_services_placeholders/elegant-beauty-salon-placeholder.png",
  "Modern Style Studio": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308340/vivahub_services_placeholders/modern-style-studio-placeholder.png",
  "Glamour & Glow Beauty Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308339/vivahub_services_placeholders/glamour-glow-beauty-salon-placeholder.png",
  "Sergi's Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744310237/vivahub_services_placeholders/sergis-salon-placeholder.png",
  "Brunella Salon": "https://res.cloudinary.com/duu9km8ss/image/upload/v1744308341/vivahub_services_placeholders/brunella-salon-placeholder.png"
};

const getSalonPlaceholder = (salonName) => {
  return salonPlaceholders[salonName] || null;
};

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await api.get(`/api/salons/${salonId}`);
        setSalon(response.data);
      } catch (error) {
        console.error("Error fetching salon details:", error);
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching salon details"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await api.get(`/api/reviews/salon/${salonId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchSalonDetails();
    fetchReviews();
  }, [salonId]);

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const SalonImageCard = ({ salon, theme }) => {
    const placeholder = getSalonPlaceholder(salon.name);
    
    return (
      <div className="w-full h-64 mb-6 rounded-lg overflow-hidden relative">
        {salon.images?.[0] ? (
          <img
            src={salon.images[0]}
            alt={salon.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              if (placeholder) {
                e.target.src = placeholder;
              } else {
                e.target.style.display = 'none';
              }
            }}
          />
        ) : placeholder ? (
          <img
            src={placeholder}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${
            theme === "light" ? "bg-gray-200" : "bg-gray-700"
          }`}>
            <span className={theme === "light" ? "text-gray-500" : "text-gray-300"}>
              {salon.name}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`font-sans leading-relaxed min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "light"
          ? "bg-white text-[#4A4A4A]"
          : "bg-gray-900 text-gray-200"
      }`}
    >
      {/* Header */}
      <header
        className={`p-4 flex justify-between items-center shadow-sm ${
          theme === "light" ? "bg-[#eeeeee]" : "bg-gray-800"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={theme === 'light' ? "/logo.png" : "/logo-dark.png"}  alt="VivaHub Logo" className="h-10" />
        </Link>

        <div className="flex items-center gap-4">
                
       

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === "light"
                ? "text-[#4A4A4A] hover:bg-[#FADADD]"
                : "text-gray-200 hover:bg-gray-700"
            } transition-colors`}
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          {/* Booking button with counter */}
          <button
            onClick={() => setIsBookingSidebarOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 ${
              theme === "light"
                ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <span>My Booking</span>
            {bookingCount > 0 && (
              <span
                className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                  theme === "light"
                    ? "bg-white text-[#4A4A4A]"
                    : "bg-gray-600 text-gray-200"
                }`}
              >
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Salon Details Section */}
      <section className="py-10 px-5 flex-grow">
  <div className="max-w-4xl mx-auto">
    <SalonImageCard salon={salon} theme={theme} />
    <h1 className={`text-3xl font-medium mb-4 ${
      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
    }`}>
      {salon.name}
          </h1>
          <p
            className={`text-lg mb-2 ${
              theme === "light" ? "text-[#4A4A4A]/80" : "text-gray-300"
            }`}
          >
            {salon.description}
          </p>
          <p
            className={`text-sm mb-1 ${
              theme === "light" ? "text-[#4A4A4A]/60" : "text-gray-400"
            }`}
          >
            <strong>Address:</strong> {salon.location}
          </p>
          <p
            className={`text-sm mb-1 ${
              theme === "light" ? "text-[#4A4A4A]/60" : "text-gray-400"
            }`}
          >
            <strong>Contact:</strong> {salon.phone}
          </p>
          <div
            className={`text-sm mb-6 ${
              theme === "light" ? "text-[#4A4A4A]/60" : "text-gray-400"
            }`}
          >
            <strong>Opening Hours:</strong>
            {salon.openingHours ? (
              <ul className="mt-2">
                {Object.entries(salon.openingHours).map(([day, hours]) => {
                  // Handle both string and object formats
                  const hoursDisplay =
                    typeof hours === "object"
                      ? `${hours.open} - ${hours.close}`
                      : hours;

                  return (
                    <li
                      key={day}
                      className={`text-sm ${
                        theme === "light" ? "text-[#4A4A4A]/80" : "text-gray-300"
                      }`}
                    >
                      <strong>
                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                      </strong>{" "}
                      {hoursDisplay}
                    </li>
                  );
                })}
              </ul>
            ) : (
              " Not available"
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className={`py-10 px-5 ${
          theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-xl font-medium mb-6 ${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            }`}
          >
            Services
          </h2>
          {salon.services && salon.services.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {salon.services.map((service) => (
                <li
                  key={service._id}
                  className={`rounded-lg shadow-sm p-5 hover:shadow-md transition duration-300 ${
                    theme === "light"
                      ? "bg-white border-[#E0E0E0]"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {service.name}
                  </h3>
                  {service.description && (
                    <p
                      className={`text-sm mb-1 ${
                        theme === "light"
                          ? "text-[#4A4A4A]/80"
                          : "text-gray-300"
                      }`}
                    >
                      {service.description}
                    </p>
                  )}
                  <p
                    className={`text-sm mb-1 ${
                      theme === "light"
                        ? "text-[#4A4A4A]/80"
                        : "text-gray-300"
                    }`}
                  >
                    <strong>Price:</strong> ${service.price}
                  </p>
                  <p
                    className={`text-sm mb-4 ${
                      theme === "light"
                        ? "text-[#4A4A4A]/80"
                        : "text-gray-300"
                    }`}
                  >
                    <strong>Duration:</strong> {service.duration} minutes
                  </p>
                  <button
                    onClick={() => {
                      addToBooking(service);
                      setIsBookingSidebarOpen(true);
                    }}
                    className={`w-full py-2 rounded transition duration-300 ${
                      theme === "light"
                        ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                        : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                    }`}
                  >
                    Add to booking
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`text-center ${
                theme === "light" ? "text-[#4A4A4A]/60" : "text-gray-400"
              }`}
            >
              No services available for this salon.
            </p>
          )}
        </div>
      </section>

      {/* Google Maps Placeholder Section */}
      <section className="py-10 px-5">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-xl font-medium mb-6 ${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            }`}
          >
            Location
          </h2>
          <div
            className={`w-full h-64 flex items-center justify-center ${
              theme === "light" ? "bg-gray-200" : "bg-gray-700"
            }`}
          >
            <p className={theme === "light" ? "text-gray-500" : "text-gray-300"}>
              Google Maps Placeholder
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-10 px-5">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-2xl font-medium mb-6 ${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            }`}
          >
            Reviews
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <p
              className={theme === "light" ? "text-[#4A4A4A]/80" : "text-gray-300"}
            >
              No reviews available for this salon yet.
            </p>
          )}

          {isAuthenticated && user?.role === "customer" ? (
            showReviewForm ? (
              <div className="mt-8">
                <ReviewForm
                  salonId={salonId}
                  onReviewSubmitted={handleReviewSubmitted}
                  theme={theme}
                />
                <button
                  onClick={() => setShowReviewForm(false)}
                  className={`mt-4 underline ${
                    theme === "light" ? "text-[#4A4A4A]" : "text-gray-300"
                  }`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewForm(true)}
                className={`mt-6 px-6 py-2 rounded transition duration-300 ${
                  theme === "light"
                    ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                Write a Review
              </button>
            )
          ) : isAuthenticated ? (
            <p
              className={`mt-6 italic ${
                theme === "light" ? "text-[#4A4A4A]/80" : "text-gray-300"
              }`}
            >
              Only customers can write reviews.
            </p>
          ) : (
            <p
              className={`mt-6 italic ${
                theme === "light" ? "text-[#4A4A4A]/80" : "text-gray-300"
              }`}
            >
              <Link
                to="/login"
                className={`${
                  theme === "light" ? "text-[#FADADD]" : "text-gray-400"
                } hover:underline`}
              >
                Log in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>
      </section>

      {/* Meet the Staff Section */}
      <section
        className={`py-10 px-5 ${
          theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-xl font-medium mb-6 ${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            }`}
          >
            Meet the Staff
          </h2>
          {salon.staff && salon.staff.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {salon.staff.map((member) => (
                <li
                  key={member._id}
                  className={`p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300 ${
                    theme === "light"
                      ? "bg-[#F8F8F8] border-[#E0E0E0]"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p
                    className={`text-sm mb-2 ${
                      theme === "light"
                        ? "text-[#4A4A4A]/80"
                        : "text-gray-300"
                    }`}
                  >
                    <strong>Role:</strong> {member.role}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "light"
                        ? "text-[#4A4A4A]/80"
                        : "text-gray-300"
                    }`}
                  >
                    {member.bio}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`text-center ${
                theme === "light" ? "text-[#4A4A4A]/60" : "text-gray-400"
              }`}
            >
              No staff information available.
            </p>
          )}
        </div>
      </section>

      {/* Nearby Salons Section */}
      <section
        className={`py-10 px-5 ${
          theme === "light" ? "bg-[#F8F8F8]" : "bg-gray-800"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-xl font-medium mb-6 ${
              theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
            }`}
          >
            Nearby Salons
          </h2>
          {salon.nearbySalons && salon.nearbySalons.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {salon.nearbySalons.map((nearbySalon) => (
                <li
                  key={nearbySalon._id}
                  className={`rounded-lg shadow-sm p-5 hover:shadow-md transition duration-300 ${
                    theme === "light"
                      ? "bg-white border-[#E0E0E0]"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                    }`}
                  >
                    {nearbySalon.name}
                  </h3>
                  <p
                    className={`text-sm mb-2 ${
                      theme === "light"
                        ? "text-[#4A4A4A]/80"
                        : "text-gray-300"
                    }`}
                  >
                    {nearbySalon.location}
                  </p>
                  <Link
                    to={`/salons/${nearbySalon._id}`}
                    className={`text-sm ${
                      theme === "light" ? "text-[#A2B9C6]" : "text-gray-400"
                    } hover:underline`}
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`text-center ${
                theme === "light" ? "text-[#4A4A4A]/60" : "text-gray-400"
              }`}
            >
              No nearby salons available.
            </p>
          )}
        </div>
      </section>

      {/* Booking Sidebar */}
      <BookingSidebar
        isOpen={isBookingSidebarOpen}
        onClose={() => setIsBookingSidebarOpen(false)}
        theme={theme}
      />
    </div>
  );
};

export default SalonDetailsPage;