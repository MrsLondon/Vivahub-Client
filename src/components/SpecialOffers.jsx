import { Link } from "react-router-dom";

const SpecialOffers = () => {
  return (
    <section className="py-10 px-5 bg-[#F8F8F8] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <img
            src="/coupon.png"
            alt="Discount Coupon"
            className="mx-auto mb-4 w-48 h-48 object-contain"
          />
          <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Get a Special Discount</h3>
          <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300 mb-4">
            Claim your exclusive discount coupon for your next salon visit.
          </p>
          <Link
            to="/special-offers"
            className="font-body px-6 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
          >
            Claim Now
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <img
            src="/nails1.png"
            alt="Top Rated Salons"
            className="mx-auto mb-4 w-48 h-48 object-contain"
          />
          <h3 className="font-heading text-lg font-medium text-[#4A4A4A] dark:text-gray-200 mb-2">Top Rated Salons</h3>
          <p className="font-body text-sm text-[#4A4A4A]/80 dark:text-gray-300 mb-4">
            Explore the highest-rated salons in your area and book today.
          </p>
          <Link
            to="/filter/top-rated"
            className="font-body px-6 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
          >
            View Salons
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;