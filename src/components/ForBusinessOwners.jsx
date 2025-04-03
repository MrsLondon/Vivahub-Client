import { Link } from "react-router-dom";

const ForBusinessOwners = () => {
  return (
    <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left Side: Text Content */}
        <div className="text-center md:text-left flex flex-col justify-center">
          <h2 className="font-heading text-xl font-medium mb-6 text-[#4A4A4A] dark:text-gray-200">Are You a Salon Owner?</h2>
          <p className="font-body text-[#4A4A4A]/80 dark:text-gray-300 mb-8">
            Join VivaHub and grow your business by reaching thousands of potential customers. 
            Showcase your services, manage bookings, and increase your revenue.
            <br />
            <br />
            <Link
              to="/signup"
              className="font-body px-4 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
            >
              Partner with Us
            </Link>
          </p>
        </div>

        {/* Right Side: Regular Image */}
        <div className="flex justify-center">
          <img
            src="/business-owner1.jpg"
            alt="Business Owner"
            className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    </section>
  );
};

export default ForBusinessOwners;