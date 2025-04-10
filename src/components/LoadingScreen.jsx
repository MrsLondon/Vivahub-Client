// components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = ({ theme }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        {theme === 'dark' ? (
          <>
            <img 
              src="/logo-animation-dark.gif" 
              alt="Loading" 
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
            />
            <p className={`mt-2 text-lg md:text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Loading
            </p>
          </>
        ) : (
          <>
            <img 
              src="/logo-animation-light.gif" 
              alt="Loading" 
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;