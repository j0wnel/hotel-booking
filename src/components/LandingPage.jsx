import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <header className="relative h-hero flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Luxury Stays</h1>
          <p className="text-xl md:text-2xl mb-8">Discover comfort and elegance at our handpicked hotels</p>
          <button className="btn-primary">Book Now</button>
        </div>
      </header>

      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-primary mb-4">Luxury Rooms</h3>
              <p className="text-gray-600">Experience comfort in our carefully designed rooms</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-primary mb-4">Best Locations</h3>
              <p className="text-gray-600">Prime locations in the heart of your destination</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-primary mb-4">24/7 Service</h3>
              <p className="text-gray-600">Round-the-clock support for your comfort</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Stay</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <input
              type="text"
              placeholder="Where do you want to stay?"
              className="input-field"
            />
            <input
              type="date"
              placeholder="Check-in"
              className="input-field"
            />
            <input
              type="date"
              placeholder="Check-out"
              className="input-field"
            />
            <button className="btn-primary">
              Search Hotels
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-primary mb-4">About Us</h4>
              <p className="text-gray-300">Providing luxury accommodation since 2025</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-primary mb-4">Contact</h4>
              <p className="text-gray-300">Email: info@luxurystays.com</p>
              <p className="text-gray-300">Phone: +1 234 567 890</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;