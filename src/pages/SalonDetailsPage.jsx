import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

const SalonDetailsPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
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
          setReviews(data);
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
        <Link to="/">
          <img src="/src/assets/logo.png" alt="VivaHub Logo" className="h-10" />
        </Link>
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
          <p className="text-sm text-[#4A4A4A]/60 mb-1">
            <strong>Contact:</strong> {salon.phone}
          </p>
          <p className="text-sm text-[#4A4A4A]/60 mb-6">
            <strong>Opening Hours:</strong>
            {salon.openingHours ? (
              <ul className="mt-2">
                {Object.entries(salon.openingHours).map(([day, hours]) => (
                  <li key={day} className="text-sm text-[#4A4A4A]/80">
                    <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {hours}
                  </li>
                ))}
              </ul>
            ) : (
              " Not available"
            )}
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

      {/* Google Maps Placeholder Section */}
      <section className="py-10 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Location</h2>
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Google Maps Placeholder</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-10 px-5 bg-[#F8F8F8]">
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

      {/* Meet the Staff Section */}
      <section className="py-10 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Meet the Staff</h2>
          {salon.staff && salon.staff.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {salon.staff.map((member) => (
                <li
                  key={member._id}
                  className="bg-[#F8F8F8] p-5 rounded-lg shadow-sm border border-[#E0E0E0] hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#4A4A4A]/80 mb-2">
                    <strong>Role:</strong> {member.role}
                  </p>
                  <p className="text-sm text-[#4A4A4A]/80">{member.bio}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#4A4A4A]/60">
              No staff information available.
            </p>
          )}
        </div>
      </section>

      {/* Nearby Salons Section */}
      <section className="py-10 px-5 bg-[#F8F8F8]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-[#4A4A4A] mb-6">Nearby Salons</h2>
          {salon.nearbySalons && salon.nearbySalons.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {salon.nearbySalons.map((nearbySalon) => (
                <li
                  key={nearbySalon._id}
                  className="bg-white rounded-lg shadow-sm p-5 border border-[#E0E0E0] hover:shadow-md transition duration-300"
                >
                  <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">
                    {nearbySalon.name}
                  </h3>
                  <p className="text-sm text-[#4A4A4A]/80 mb-2">
                    {nearbySalon.location}
                  </p>
                  <Link
                    to={`/salon/${nearbySalon._id}`}
                    className="text-sm text-[#A2B9C6] hover:underline"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#4A4A4A]/60">
              No nearby salons available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SalonDetailsPage;