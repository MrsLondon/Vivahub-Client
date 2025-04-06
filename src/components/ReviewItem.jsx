import React, { useState } from 'react';
import StarRating from './StarRating';

const ReviewItem = ({ review }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="font-medium mr-2">
          {review.customerId?.firstName} {review.customerId?.lastName}
        </div>
        <StarRating rating={review.rating} />
      </div>
      
      <p className="text-[#4A4A4A]/80 mb-3">{review.comment}</p>
      
      {/* Display image if available */}
      {review.image && (
        <div className="mb-3">
          <img 
            src={review.image} 
            alt="Review" 
            className="h-32 w-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowFullImage(true)}
          />
          
          {/* Lightbox for full-size image */}
          {showFullImage && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setShowFullImage(false)}
            >
              <div className="relative max-w-4xl max-h-full">
                <img 
                  src={review.image} 
                  alt="Review full size" 
                  className="max-h-[90vh] max-w-full object-contain"
                />
                <button 
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullImage(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-[#4A4A4A]/60">
        {formatDate(review.createdAt)}
      </div>
    </div>
  );
};

export default ReviewItem;
