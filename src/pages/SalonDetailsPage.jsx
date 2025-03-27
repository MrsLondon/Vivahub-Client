import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

const SalonDetailsPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/salons/${salonId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSalon(data);
        } else {
          setError("Failed to fetch salon details");
        }
      } catch (error) {
        console.error("Error fetching salon details:", error);
        setError("An error occurred while fetching salon details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reviews/salon/${salonId}`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data); // Store reviews in state
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchSalonDetails();
    fetchReviews();
  }, [salonId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 bg-[#eeeeee] flex justify-between items-center shadow-sm">
        <img src="/src/assets/logo.png" alt="VivaHub Logo" className="h-10" />
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-[#FADADD] text-[#4A4A4A] rounded-lg text-sm hover:bg-[#A2B9C6] hover:text-white transition duration-300"
        >
          Back to Home
        </button>
      </header>

      {/* Salon Details Section */}
      <section className="py-10 px-5 bg-white flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium text-[#4A4A4A] mb-4">
            {salon.name}
          </h1>
          <p className="text-lg text-[#4A4A4A]/80 mb-2">{salon.description}</p>
          <p className="text-sm text-[#4A4A4A]/60 mb-1">
            <strong>Address:</strong> {salon.location}
          </p>
          <p className="text-sm text-[#4A4A4A]/60 mb-6">
            <strong>Contact:</strong> {salon.phone}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 px-5 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Services</h2>
          {salon.services.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {salon.services.map((service) => (
                <li
                  key={service._id}
                  className="bg-white rounded-lg shadow-sm p-5 border border-[#E0E0E0] hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[#4A4A4A]/80 mb-1">
                    <strong>Price:</strong> ${service.price}
                  </p>
                  <p className="text-sm text-[#4A4A4A]/80 mb-4">
                    <strong>Duration:</strong> {service.duration} minutes
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/booking/${salonId}/${service._id}`)
                    }
                    className="w-full py-2 bg-[#FADADD] text-[#4A4A4A] rounded hover:bg-[#f0c8cc] transition duration-300"
                  >
                    Book this service
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#4A4A4A]/60">
              No services available for this salon.
            </p>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-10 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <li
                  key={review._id}
                  className="bg-[#F8F8F8] p-5 rounded-lg shadow-sm border border-[#E0E0E0] hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">
                    {review.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A]/80 mb-2">
                    {review.comment}
                  </p>
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-[#4A4A4A]/60">
                    <strong>Rating:</strong> {review.rating} / 5
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#4A4A4A]/60">
              No reviews available for this salon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SalonDetailsPage;
