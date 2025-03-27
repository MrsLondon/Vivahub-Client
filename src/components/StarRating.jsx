import React from "react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: rating }).map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFD700"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.75.75 0 011.04 0l2.146 2.18 3.05.442a.75.75 0 01.416 1.28l-2.206 2.15.52 3.03a.75.75 0 01-1.088.79L12 11.347l-2.728 1.424a.75.75 0 01-1.088-.79l.52-3.03-2.206-2.15a.75.75 0 01.416-1.28l3.05-.442 2.146-2.18z"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
