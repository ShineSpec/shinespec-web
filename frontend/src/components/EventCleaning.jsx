import React from "react";
import { Circle, Users, CalendarCheck, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EventCleaning = () => {
    const navigate = useNavigate();

    const handleServiceClick = (service) => {
        navigate("/services/booking", { state: { selectedService: service } });
      };
      

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50
      py-12 px-4 sm:py-16 md:py-20 md:px-12 lg:px-20
      flex flex-col lg:flex-row items-center justify-between"
    >
      {/* Text Content */}
      <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 lg:pl-10 xl:pl-30 space-y-6 md:space-y-8 relative z-20">

        <div className="mb-6 md:mb-8" data-aos="fade-right">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 text-center lg:text-left">
            Event
            <span className="font-bold text-black block lg:inline">
              {" "}Cleaning<span className="text-blue-500">.</span>
            </span>
          </h2>

          <div className="flex gap-3 mt-4 justify-center lg:justify-start">
            <Circle className="text-pink-500 w-5 h-5" />
            <Circle className="text-blue-500 w-5 h-5" />
            <Circle className="text-green-500 w-5 h-5" />
          </div>
        </div>

        <p
          className="text-base sm:text-lg text-gray-800 leading-relaxed text-center lg:text-left"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          We provide reliable, professional event cleaning services for weddings,
          parties, corporate functions, and special occasions. From pre-event
          setup to post-event cleanup, our trained teams ensure your venue stays
          spotless and stress-free.
        </p>

        {/* Feature Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-10"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-md
          md:shadow-lg transition-all hover:shadow-xl">
            <div className="w-10 h-10 md:w-12 flex items-center justify-center rounded-lg bg-blue-100 mb-3 md:mb-4">
              <CalendarCheck className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              Flexible Scheduling
            </h3>
            <p className="text-gray-700 text-xs md:text-sm">
              Book cleaning before, during, or after your event to match your
              exact needs and timeline.
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-md
          md:shadow-lg transition-all hover:shadow-xl">
            <div className="w-10 h-10 md:w-12 flex items-center justify-center rounded-lg bg-green-100 mb-3 md:mb-4">
              <Sparkles className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              Spotless Results
            </h3>
            <p className="text-gray-700 text-xs md:text-sm">
              Our experienced cleaners handle everything from spills to full
              venue cleanups with attention to detail.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          className="flex justify-center lg:justify-start mt-8 md:mt-10"
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
              
            className="px-6 py-3 md:px-8 md:py-4 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm md:text-base"
            >
              Book Event Cleaning
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
        </div>
      </div>

      {/* Image */}
      <div className="flex-1 w-full lg:ml-8 xl:ml-12 relative mt-10 lg:mt-0">
        <div
          className="w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl
          h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]
          overflow-hidden shadow-lg md:shadow-xl relative z-10 rotate-2
          rounded-[30%_70%_60%_40%/40%_40%_60%_60%]
          hover:rotate-0 transition-transform duration-700"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <img
            src="/events.png"
            alt="Event Cleaning"
            className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  );
};

export default EventCleaning;
