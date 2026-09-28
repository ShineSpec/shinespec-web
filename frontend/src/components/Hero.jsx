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

    navigate("/services/booking", {
      state: { selectedService: service },
    });
  };

  const handleBookServiceClick = () => {
    navigate("/services");
  };

  return (
    <>
      <section
        className="
          relative
          w-full
          overflow-hidden
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          xl:px-16
          pt-16
          sm:pt-20
          md:pt-24
          lg:pt-28
          pb-10
          sm:pb-12
          lg:pb-14
        "
      >
        <div className="mx-auto w-full max-w-7xl">

          {/* Main Hero */}
          <div
            className="
              flex
              flex-col
              lg:flex-row
              items-center
              justify-center
              gap-8
              md:gap-10
              lg:gap-12
              xl:gap-14
            "
          >

            {/* Image */}
            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="
                order-1
                lg:order-2
                w-full
                lg:w-[40%]
                flex
                justify-center
              "
            >
              <div
                className="
                  relative
                  w-[210px]
                  h-[210px]
                  sm:w-[250px]
                  sm:h-[250px]
                  md:w-[290px]
                  md:h-[290px]
                  lg:w-[370px]
                  lg:h-[370px]
                  xl:w-[430px]
                  xl:h-[400px]
                  overflow-hidden
                  border-4
                  sm:border-6
                  lg:border-8
                  border-white
                  shadow-lg
                  rounded-[60%_40%_30%_60%/60%_30%_70%_30%]
                "
              >
                <img
                  src="/cleaning-spray.png"
                  alt="Professional cleaning services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Left Content */}
            <div
              className="
                order-2
                lg:order-1
                w-full
                lg:w-[60%]
                flex
                flex-col
                items-center
                lg:items-start
                text-center
                lg:text-left
              "
            >

              {/* Heading */}
              <h2
                data-aos="fade-right"
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  leading-tight
                  text-gray-900
                  font-normal
                "
              >
                Professional{" "}
                <span className="font-bold text-black">
                  Services<span className="text-blue-500">.</span>
                </span>
              </h2>

              {/* Dots */}
              <div
                data-aos="fade-right"
                data-aos-delay="100"
                className="flex gap-2 mt-3 sm:mt-4"
              >
                <Circle className="text-pink-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <Circle className="text-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <Circle className="text-green-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Services */}
              <div
                className="
                  w-full
                  grid
                  grid-cols-2
                  sm:grid-cols-4
                  lg:grid-cols-4
                  xl:grid-cols-8
                  gap-x-3
                  sm:gap-x-4
                  md:gap-x-5
                  lg:gap-x-4
                  xl:gap-x-6
                  gap-y-5
                  sm:gap-y-6
                  lg:gap-y-7
                  mt-6
                  sm:mt-7
                  lg:mt-8
                "
              >
                {services.map((service, index) => (
                  <div
                    key={index}
                    data-aos="zoom-in"
                    data-aos-delay={150 + index * 50}
                    onClick={() => handleServiceClick(service)}
                    className="
                      flex
                      flex-col
                      items-center
                      justify-start
                      gap-1.5
                      cursor-pointer
                      group
                      min-w-0
                    "
                  >
                    {/* Icon */}
                    <div
                      className="
                        relative
                        w-12
                        h-12
                        sm:w-14
                        sm:h-14
                        md:w-16
                        md:h-16
                        lg:w-14
                        lg:h-14
                        xl:w-16
                        xl:h-16
                        flex
                        items-center
                        justify-center
                        rounded-full
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-0
                          rounded-full
                          bg-blue-500
                          opacity-0
                          group-hover:opacity-10
                          transition-opacity
                          duration-300
                        "
                      />

                      <img
                        src={service.img}
                        alt={service.label}
                        className="
                          relative
                          z-10
                          w-10
                          h-10
                          sm:w-11
                          sm:h-11
                          md:w-12
                          md:h-12
                          lg:w-12
                          lg:h-12
                          xl:w-14
                          xl:h-14
                          object-contain
                        "
                      />
                    </div>

                    {/* Service Name */}
                    <span
                      className="
                        text-[10px]
                        sm:text-[11px]
                        md:text-xs
                        lg:text-[11px]
                        xl:text-xs
                        text-gray-700
                        font-medium
                        text-center
                        leading-tight
                        max-w-[80px]
                        sm:max-w-[90px]
                        group-hover:text-blue-600
                        transition-colors
                      "
                    >
                      {service.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="
                  w-full
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  justify-center
                  lg:justify-start
                  gap-3
                  sm:gap-4
                  mt-7
                  sm:mt-8
                "
              >
                <button
                  onClick={handleBookServiceClick}
                  className="
                    w-full
                    sm:w-auto
                    min-w-[175px]
                    px-6
                    py-3
                    bg-blue-500
                    hover:bg-blue-700
                    text-white
                    text-sm
                    font-semibold
                    rounded-full
                    shadow-lg
                    hover:shadow-xl
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >
                  Book a Service
                </button>

                <button
                  onClick={() => navigate("/fulltime-help")}
                  className="
                    w-full
                    sm:w-auto
                    min-w-[175px]
                    px-6
                    py-3
                    bg-white
                    hover:bg-gray-50
                    text-blue-500
                    text-sm
                    font-semibold
                    rounded-full
                    border-2
                    border-blue-600
                    shadow-md
                    hover:shadow-lg
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >
                  Find Full-Time Help
                </button>
              </div>

              {/* Worker Link */}
              <div
                data-aos="fade-up"
                data-aos-delay="500"
                className="mt-4 sm:mt-5"
              >
                <p className="text-xs sm:text-sm text-gray-600">
                  Are you a worker?{" "}
                  <a
                    href="/apply-as-worker"
                    className="
                      text-blue-600
                      font-semibold
                      hover:text-gray-700
                      underline
                      transition-colors
                    "
                  >
                    Apply Now
                  </a>
                </p>
              </div>

            </div>
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