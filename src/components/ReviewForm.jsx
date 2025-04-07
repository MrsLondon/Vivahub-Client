import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ReviewForm = ({ bookingId, salonId, serviceId, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle login redirect if user is not authenticated
  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname;
    navigate(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value, 10) : value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Submit the review
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      handleLoginRedirect();
      return;
    }

    if (user.role !== 'customer') {
      setError('Only customers can submit reviews.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log("Submitting review with:", { bookingId, salonId, serviceId });
      
      // Create form data for multipart/form-data submission
      const reviewFormData = new FormData();
      if (bookingId) {
        reviewFormData.append('bookingId', bookingId);
      } else if (salonId && serviceId) {
        // If no bookingId is provided, use salonId and serviceId directly
        reviewFormData.append('salonId', salonId);
        reviewFormData.append('serviceId', serviceId);
      } else {
        throw new Error("Either bookingId or both salonId and serviceId must be provided");
      }
      
      reviewFormData.append('rating', formData.rating);
      reviewFormData.append('comment', formData.comment);
      
      // Add image if selected
      if (image) {
        reviewFormData.append('image', image);
      }

      // Log the form data for debugging
      for (let [key, value] of reviewFormData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Submit the review
      const response = await api.post('/api/reviews', reviewFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        },
      });

      console.log("Review submission successful:", response.data);

      // Clear form and notify parent component
      setFormData({ rating: 5, comment: '' });
      setImage(null);
      setImagePreview(null);
      
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(
        err.response?.data?.message || 
        'There was an error submitting your review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-medium text-[#4A4A4A] mb-4">Write a Review</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Rating selection */}
        <div className="mb-4">
          <label className="block text-[#4A4A4A] text-sm font-medium mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="text-2xl focus:outline-none"
              >
                <span className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Comment textarea */}
        <div className="mb-4">
          <label htmlFor="comment" className="block text-[#4A4A4A] text-sm font-medium mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FADADD]"
            placeholder="Share your experience..."
            required
          ></textarea>
        </div>
        
        {/* Image upload */}
        <div className="mb-4">
          <label className="block text-[#4A4A4A] text-sm font-medium mb-2">
            Add a Photo (Optional)
          </label>
          
          {imagePreview ? (
            <div className="relative w-full h-48 mb-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition duration-150"
                 onClick={() => document.getElementById('image-upload').click()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">Click to upload a photo</p>
            </div>
          )}
          
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, JPEG, PNG. Max size: 5MB.
          </p>
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-[#FADADD] text-[#4A4A4A] rounded-md hover:bg-[#f0c8cc] transition duration-300 font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
