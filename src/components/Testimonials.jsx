const Testimonials = () => {
    return (
      <section className="py-10 px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-heading text-xl font-medium mb-8 text-[#4A4A4A] dark:text-gray-200 text-center">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              text: "The booking process was seamless and the salon exceeded my expectations!",
              author: "Emma S.",
              rating: 5
            },
            {
              text: "I love how easy VivaHub makes it to find quality salons in my area.",
              author: "Michael T.",
              rating: 4
            },
            {
              text: "Professional services every time. Highly recommend to anyone looking for beauty services.",
              author: "Sarah L.",
              rating: 5
            }
          ].map((review, index) => (
            <div
              key={index}
              className="bg-[#F8F8F8] dark:bg-gray-800 rounded-lg p-5 border border-[#E0E0E0] dark:border-gray-700"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-[#FADADD] dark:text-[#dcbd73]" : "text-[#E0E0E0] dark:text-gray-500"}>★</span>
                ))}
              </div>
              <p className="font-body text-[#4A4A4A] dark:text-gray-300 mb-4 italic">"{review.text}"</p>
              <p className="font-body text-sm font-medium text-[#4A4A4A] dark:text-gray-200">— {review.author}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Testimonials;