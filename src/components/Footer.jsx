import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 px-5 bg-[#4A4A4A] dark:bg-gray-900 text-white dark:text-gray-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-heading text-lg font-medium mb-4">VivaHub</h3>
          <p className="font-body text-sm text-white/80 dark:text-gray-400">
            Your premier salon booking platform
          </p>
        </div>
        <div>
          <h4 className="font-heading font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
            <li>
              <Link
                to="/about"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to="/press"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-medium mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
            <li>
              <Link
                to="/help-center"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/faqs"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-medium mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
            <li>
              <Link
                to="/privacy-policy"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                to="/terms-of-service"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                to="/cookie-policy"
                className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="font-body max-w-6xl mx-auto pt-8 mt-8 border-t border-white/10 dark:border-gray-700 text-sm text-white/60 dark:text-gray-500">
        &copy; {new Date().getFullYear()} VivaHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;