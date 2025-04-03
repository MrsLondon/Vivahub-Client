const AboutApp = () => {
    return (
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-xl font-medium mb-6 text-[#4A4A4A] dark:text-gray-200">Why Choose VivaHub?</h2>
          <p className="font-body text-[#4A4A4A]/80 dark:text-gray-300 mb-8">
            VivaHub is your one-stop platform for discovering and booking top-rated salons. 
            Enjoy seamless booking, exclusive discounts, and access to the best beauty services in your area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="/beauty-salon-pink.png" alt="Feature 1" className="mx-auto mb-4" />
              <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Discover Top Salons</h3>
              <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300">
                Find the best salons near you with verified reviews and ratings.
              </p>
            </div>
            <div className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="/discount.png" alt="Feature 2" className="mx-auto mb-4" />
              <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Exclusive Discounts</h3>
              <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300">
                Enjoy special offers and discounts on your favorite services.
              </p>
            </div>
            <div className="bg-[#F8F8F8] dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <img src="/computer.png" alt="Feature 3" className="mx-auto mb-4" />
              <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Easy Booking</h3>
              <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300">
                Book your appointments in just a few clicks, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutApp;