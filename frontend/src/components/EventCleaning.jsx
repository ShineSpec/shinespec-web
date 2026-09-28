import React from "react";
import { Circle, CalendarCheck, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCleaning = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate("/services/booking", {
      state: { selectedService: service },
    });
  };

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-br from-gray-50 to-green-50
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
        pt-12 sm:pt-14 md:pt-16 lg:pt-20
        pb-10 sm:pb-12 md:pb-14 lg:pb-16
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          flex flex-col lg:flex-row
          items-center justify-between
          gap-8 sm:gap-10 md:gap-12 lg:gap-10 xl:gap-16
        "
      >
        {/* ==================== TEXT CONTENT ==================== */}
        <div
          className="
            w-full lg:flex-1
            max-w-2xl
            mx-auto lg:mx-0
            relative z-20
          "
        >
          {/* Heading */}
          <div
            className="mb-5 sm:mb-6 md:mb-7"
            data-aos="fade-right"
          >
            <h2
              className="
                text-2xl sm:text-3xl md:text-4xl xl:text-5xl
                leading-tight
                font-normal
                text-gray-900
                text-center lg:text-left
              "
            >
              Event{" "}
              <span className="font-bold text-black">
                Cleaning<span className="text-blue-500">.</span>
              </span>
            </h2>

            {/* Decorative circles */}
            <div
              className="
                flex items-center
                gap-2 sm:gap-2.5
                mt-3 sm:mt-4
                justify-center lg:justify-start
              "
            >
              <Circle className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
              <Circle className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
              <Circle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Description */}
          <p
            className="
              text-sm sm:text-base md:text-[17px]
              leading-relaxed
              text-gray-800
              text-center lg:text-left
              max-w-xl
              mx-auto lg:mx-0
            "
            data-aos="fade-right"
            data-aos-delay="100"
          >
            We provide reliable, professional event cleaning services for
            weddings, parties, corporate functions, and special occasions.
            From pre-event setup to post-event cleanup, our trained teams
            ensure your venue stays spotless and stress-free.
          </p>

          {/* ==================== FEATURE CARDS ==================== */}
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2
              gap-3 sm:gap-4 md:gap-5
              mt-6 sm:mt-7 md:mt-8
            "
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {/* Flexible Scheduling */}
            <div
              className="
                bg-white
                p-4 sm:p-5 md:p-5
                rounded-xl md:rounded-2xl
                border border-gray-100
                shadow-sm sm:shadow-md
                transition-all duration-300
                hover:shadow-lg
              "
            >
              <div
                className="
                  w-9 h-9
                  sm:w-10 sm:h-10
                  md:w-11 md:h-11
                  flex items-center justify-center
                  rounded-lg
                  bg-blue-100
                  mb-2.5 sm:mb-3
                "
              >
                <CalendarCheck
                  className="
                    text-blue-600
                    w-4 h-4
                    sm:w-5 sm:h-5
                    md:w-5 md:h-5
                  "
                />
              </div>

              <h3
                className="
                  text-sm sm:text-base md:text-lg
                  font-semibold
                  text-gray-800
                  mb-1.5 sm:mb-2
                "
              >
                Flexible Scheduling
              </h3>

              <p
                className="
                  text-gray-700
                  text-xs sm:text-sm
                  leading-relaxed
                "
              >
                Book cleaning before, during, or after your event to match
                your exact needs and timeline.
              </p>
            </div>

            {/* Spotless Results */}
            <div
              className="
                bg-white
                p-4 sm:p-5 md:p-5
                rounded-xl md:rounded-2xl
                border border-gray-100
                shadow-sm sm:shadow-md
                transition-all duration-300
                hover:shadow-lg
              "
            >
              <div
                className="
                  w-9 h-9
                  sm:w-10 sm:h-10
                  md:w-11 md:h-11
                  flex items-center justify-center
                  rounded-lg
                  bg-green-100
                  mb-2.5 sm:mb-3
                "
              >
                <Sparkles
                  className="
                    text-green-600
                    w-4 h-4
                    sm:w-5 sm:h-5
                    md:w-5 md:h-5
                  "
                />
              </div>

              <h3
                className="
                  text-sm sm:text-base md:text-lg
                  font-semibold
                  text-gray-800
                  mb-1.5 sm:mb-2
                "
              >
                Spotless Results
              </h3>

              <p
                className="
                  text-gray-700
                  text-xs sm:text-sm
                  leading-relaxed
                "
              >
                Our experienced cleaners handle everything from spills to
                full venue cleanups with attention to detail.
              </p>
            </div>
          </div>

          {/* ==================== CTA ==================== */}
          <div
            className="
              flex
              justify-center lg:justify-start
              mt-6 sm:mt-7 md:mt-8
            "
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <button
              onClick={() =>
                handleServiceClick({
                  label: "Event Cleaning",
                  img: "/event.png",
                })
              }
              className="
                px-5 sm:px-6
                py-2.5 sm:py-3
                md:px-7 md:py-3.5
                bg-blue-500
                text-white
                rounded-full
                font-medium
                text-xs sm:text-sm md:text-base
                flex items-center justify-center
                gap-1.5 sm:gap-2
                shadow-md
                hover:bg-blue-600
                hover:shadow-lg
                transition-all duration-300
                whitespace-nowrap
              "
            >
              Book Event Cleaning
              <ArrowRight
                className="
                  w-4 h-4
                  sm:w-4.5 sm:h-4.5
                  md:w-5 md:h-5
                "
              />
            </button>
          </div>
        </div>

        {/* ==================== IMAGE ==================== */}
        <div
          className="
            w-full lg:flex-1
            relative
            flex justify-center
            mt-2 sm:mt-4 md:mt-6 lg:mt-0
          "
        >
          <div
            className="
              relative z-10
              w-full
              max-w-[280px]
              sm:max-w-[340px]
              md:max-w-[400px]
              lg:max-w-[460px]
              xl:max-w-[520px]
              aspect-[4/3]
              overflow-hidden
              shadow-lg md:shadow-xl
              rotate-2
              rounded-[30%_70%_60%_40%/40%_40%_60%_60%]
              hover:rotate-0
              transition-transform duration-700
            "
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <img
              src="/events.png"
              alt="Event Cleaning"
              className="
                w-full h-full
                object-cover
                transition-transform duration-700
                hover:scale-105
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCleaning;