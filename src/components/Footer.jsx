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
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">About</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Careers</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Help Center</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Blog</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-gray-400">
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Privacy</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Terms</a></li>
              <li><a href="#" className="font-body hover:text-[#FADADD] dark:hover:text-[#FADADD]">Cookie Policy</a></li>
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