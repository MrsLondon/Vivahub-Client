import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-12 px-5 bg-[#A2B9C6] dark:bg-gray-800 text-white dark:text-[#4A4A4A] text-center border-b border-[#A2B9C6] dark:border-[#FADADD]">
      <h2 className="font-heading text-2xl font-normal mb-4 tracking-tight dark:text-gray-200">Ready to Book Your Next Appointment?</h2>
      <p className="font-body max-w-2xl mx-auto mb-6 opacity-90 dark:text-gray-200">
        Join thousands of satisfied customers using VivaHub
      </p>
      <Link to="/signup">
        <button className="font-body px-6 py-3 bg-white dark:bg-[#FADADD] text-[#4A4A4A] dark:text-[#4A4A4A] rounded-lg hover:bg-[#FADADD] dark:hover:bg-[#A2B9C6] transition-colors">
          Sign Up Now
        </button>
      </Link>
    </section>
  );
};

export default CallToAction;