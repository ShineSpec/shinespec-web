import React, { useState } from "react";
import { Circle } from "lucide-react";
import BookingPage from "../pages/BookingPage";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  const services = [
    { img: "/Indoor.png", label: "Indoor Services" },
    { img: "/outdoor.png", label: "Outdoor Services" },
    { img: "/office.png", label: "Office Cleaning" },
    { img: "/moving.png", label: "Moving Cleaning" },
    { img: "/laundry.png", label: "Laundry & Ironing" },
    { img: "/mom.png", label: "Mom's Helper" },
    { img: "/elder.png", label: "Elder Care" },
    { img: "/express.png", label: "Express Cleaning" },
  ];

  const handleServiceClick = (service) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book a service");
      navigate("/login");
      return;
    }

    setSelectedService(service);
    
    // Redirect to booking page with service data
    navigate("/services/booking", { state: { selectedService: service } });
  };

  const handleBookServiceClick = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please login to book a service");
      navigate("/login");
      return;
    }
  
    navigate("/services"); // NEW PAGE
  };
  

  return (
    <>
      <section className="relative mt-20 lg:mt-40 overflow-hidden py-16 px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col-reverse lg:flex-row items-center justify-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 w-full max-w-6xl space-y-10 relative z-20 lg:ml-20">
          <h2
            className="text-4xl sm:text-5xl text-gray-900 text-center lg:text-left"
            data-aos="fade-right"
          >
            Professional{" "}
            <span className="font-bold text-black block lg:inline">
              Services<span className="text-blue-500">.</span>
            </span>
          </h2>

          {/* Dots */}
          <div
            data-aos="fade-right"
            data-aos-delay="100"
            className="flex gap-3 justify-center lg:justify-start"
          >
            <Circle className="text-pink-500 w-5 h-5"/>
            <Circle className="text-blue-500 w-5 h-5"/>
            <Circle className="text-green-500 w-5 h-5"/>
          </div>

          {/* Service Icons */}
          <div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-y-8 gap-x-8 sm:gap-y-10 lg:gap-y-12 lg:gap-x-24 mt-10 justify-items-center"
          >
            {services.map((service, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={150 + index * 50}
                onClick={() => handleServiceClick(service)}
                className="flex flex-col items-center gap-3 cursor-pointer hover:scale-110 transition-transform duration-300 group"
              >
                <div className="w-18 h-18 sm:w-16 sm:h-16 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <img
                    src={service.img}
                    alt={service.label}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-8 lg:w-20 lg:h-20 object-contain relative z-10"
                  />
                </div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium text-center leading-tight max-w-[90px] group-hover:text-blue-600 transition-colors">
                  {service.label}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mt-10"
          >
            <button 
              onClick={handleBookServiceClick}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book a Service
            </button>
            <button
              onClick={() => navigate("/fulltime-help")}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-500 font-semibold rounded-full border-2 border-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Find Full-Time Help
          </button>

            {/* <button className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-500 font-semibold rounded-full border-2 border-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Find Full-Time Help
            </button> */}
          </div>

          {/* Worker Link */}
          <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="text-center lg:text-left mt-6"
          >
            <p className="text-gray-600">
              Are you a worker?{" "}
              <a
                href="/apply-as-worker"
                className="text-blue-600 font-semibold hover:text-gray-700 underline transition-colors"
              >
                Apply Now
              </a>
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div
          data-aos="fade-left"
          data-aos-delay="400"
          className="flex-1 flex justify-center relative w-full"
        >
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[600px] lg:h-[500px] overflow-hidden border-8 border-white shadow-lg rounded-[60%_40%_30%_60%/60%_30%_70%_30%] relative z-10">
            <img
              src="/cleaning-spray.png"
              alt="Hero"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="hidden md:block absolute border-2 border-pink-500 bottom-20 left-10 w-16 h-16 
              sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full opacity-50"
              data-aos="zoom-in"
              data-aos-delay="400">
        </div>
        <div className="hidden md:block absolute border-2 border-blue-500 top-8 right-10 w-20 h-20 
              sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full opacity-50"
              data-aos="zoom-in"
              data-aos-delay="500">
        </div>
      </section>

      {/* Booking Flow Modal */}
      {showBooking && selectedService && (
        <BookingPage
          selectedService={selectedService}
          onClose={() => {
            setShowBooking(false);
            setSelectedService(null);
          }}
        />
      )}
    </>
  );
};

export default Hero;