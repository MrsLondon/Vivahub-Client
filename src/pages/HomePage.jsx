import React from "react";

const Homepage = () => {
  return (

    <div className="font-sans leading-relaxed text-[#4A4A4A] bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-10 px-5 bg-white text-center">
        <h1 className="text-3xl font-light mb-4 text-[#4A4A4A]">
          Book Your Perfect Salon Experience
        </h1>
        <p className="max-w-2xl mx-auto text-[#4A4A4A]/80 mb-8">
          Discover top-rated salons and book beauty services with ease
        </p>
      </section>

    <div className="homepage">

      {/* Search Bar Section */}
      <section className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Find Salons"
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
      </section>

      {/* Featured Salons Section */}
      <section className="featured-salons">
        <h2>Discover Featured Salons</h2>
        <div className="salon-carousel">
          <div className="salon-card">
            <img src="https://via.placeholder.com/150" alt="Salon 1" />
            <h3>Salon 1</h3>
            <p>Rating: ★★★★☆</p>
          </div>
          <div className="salon-card">
            <img src="https://via.placeholder.com/150" alt="Salon 2" />
            <h3>Salon 2</h3>
            <p>Rating: ★★★★☆</p>
          </div>
          <div className="salon-card">
            <img src="https://via.placeholder.com/150" alt="Salon 3" />
            <h3>Salon 3</h3>
            <p>Rating: ★★★★☆</p>
          </div>
        </div>
      </section>

      <section className="customer-reviews">
        <h2>What Our Customers Say</h2>
        <div className="review-carousel">
          <div className="review-card">
            <p>"Amazing service! Highly recommend."</p>
            <h4>- Jane Doe</h4>
          </div>
          <div className="review-card">
            <p>"The best salon experience I've ever had."</p>
            <h4>- John Smith</h4>
          </div>
          <div className="review-card">
            <p>"Great staff and excellent results every time."</p>
            <h4>- Sarah Lee</h4>
          </div>
          <div className="review-card">
            <p>"Affordable and professional. Will come back again!"</p>
            <h4>- Michael Brown</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#privacy">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Homepage;