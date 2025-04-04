import { FiFacebook, FiInstagram } from "react-icons/fi";

export default function SocialMedia() {
  return (
    <section className="py-12 px-5 bg-[#F8F8F8] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-heading text-xl font-medium mb-6 text-[#4A4A4A] dark:text-gray-200">
          Follow Us on Social Media
        </h2>
        <p className="font-body text-[#4A4A4A]/80 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Stay updated with the latest news, offers, and beauty tips from VivaHub.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] transition-colors border border-[#E0E0E0] dark:border-gray-600 rounded-full hover:border-[#A2B9C6] dark:hover:border-[#FADADD]"
          >
            <FiFacebook size={22} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-[#4A4A4A] dark:text-gray-200 hover:text-[#A2B9C6] dark:hover:text-[#FADADD] transition-colors border border-[#E0E0E0] dark:border-gray-600 rounded-full hover:border-[#A2B9C6] dark:hover:border-[#FADADD]"
          >
            <FiInstagram size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}