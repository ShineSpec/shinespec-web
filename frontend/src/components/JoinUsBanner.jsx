import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const JoinUsBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:py-16 md:py-20 md:px-12 lg:px-20 rounded-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
        {/* Text Content */}
        <div className="flex-1"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our <span className="text-blue-500">Team of Professionals</span>
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            Looking for work? We hire cleaners, caregivers, nannies, and more. 
            Earn money while helping families and businesses stay clean, safe, and happy.
          </p>
          <Link to="/apply-as-worker">
            <button className="bg-blue-500 text-white py-3 px-6 sm:px-8 rounded-lg font-medium shadow-md hover:bg-purple-600 hover:shadow-lg flex items-center gap-2 transition-all">
              Apply Now
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6"/>
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1 flex flex-col items-center lg:items-start">
          <div className="w-full max-w-md h-64 sm:h-72 md:h-full overflow-hidden"
            data-aos="zoom-in"
            data-aos-delay="150"
          >
            <img 
              src="/phone-service.png" 
              alt="Join Our Team" 
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div
        className="hidden md:block absolute border-2 border-pink-500 bottom-40 left-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full opacity-50"
        data-aos="zoom-in"
        data-aos-delay="700"
      ></div>
      <div
        className="hidden md:block absolute border-2 border-blue-500 top-40 right-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full opacity-50"
        data-aos="zoom-in"
        data-aos-delay="700"
      ></div>
    </section>
  );
};

export default JoinUsBanner;
