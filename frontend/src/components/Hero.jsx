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
    { img: "/event.png", label: "Event Cleaning" },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    navigate("/services/booking", { state: { selectedService: service } });
  };

  const handleBookServiceClick = () => {
    navigate("/services");
  };

  return (
    <>
      <section className="relative mt-8 sm:mt-10 lg:mt-24 xl:mt-28 overflow-hidden py-8 sm:py-10 lg:py-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 flex flex-col-reverse lg:flex-row items-center justify-center gap-8 sm:gap-10 lg:gap-10 xl:gap-16 lg:min-h-[calc(100vh-6rem)]">

        {/* Left Content */}
        <div className="flex-1 w-full max-w-6xl space-y-4 sm:space-y-6 lg:space-y-5 xl:space-y-6 relative z-20 lg:ml-12 xl:ml-20">
          <h2
            className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl text-gray-900 text-center lg:text-left"
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
            className="flex gap-2 sm:gap-3 justify-center lg:justify-start"
          >
            <Circle className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
            <Circle className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
            <Circle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Service Icons */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-y-5 sm:gap-y-8 md:gap-y-10 lg:gap-y-6 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-6 xl:gap-x-10 mt-4 sm:mt-6 lg:mt-5 justify-items-center">
            {services.map((service, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={150 + index * 50}
                onClick={() => handleServiceClick(service)}
                className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer hover:scale-110 transition-transform duration-300 group"
              >
                <div className="w-14 h-14 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <img
                    src={service.img}
                    alt={service.label}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 object-contain relative z-10"
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-gray-700 font-medium text-center leading-tight max-w-[80px] sm:max-w-[90px] group-hover:text-blue-600 transition-colors">
                  {service.label}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mt-6 sm:mt-8 lg:mt-6"
          >
            <button
              onClick={handleBookServiceClick}
              className="px-6 sm:px-8 py-2.5 sm:py-3 lg:py-3 bg-blue-500 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book a Service
            </button>
            <button
              onClick={() => navigate("/fulltime-help")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 lg:py-3 bg-white hover:bg-gray-50 text-blue-500 text-sm sm:text-base font-semibold rounded-full border-2 border-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Find Full-Time Help
            </button>
          </div>

          {/* Worker Link */}
          <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="text-center lg:text-left mt-3 sm:mt-4"
          >
            <p className="text-sm sm:text-base text-gray-600">
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
          className="hidden lg:flex flex-1 justify-center relative w-full"
        >
          <div className="lg:w-[340px] lg:h-[300px] xl:w-[420px] xl:h-[360px] 2xl:w-[480px] 2xl:h-[400px] overflow-hidden border-8 border-white shadow-lg rounded-[60%_40%_30%_60%/60%_30%_70%_30%] relative z-10">
            <img
              src="/cleaning-spray.png"
              alt="Hero"
              className="object-cover w-full h-full"
            />
          </div>
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