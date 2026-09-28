import React from "react";
import { Circle, Users, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section
      id="about"
      className="
        relative
        w-full
        overflow-hidden
        bg-gradient-to-br
        from-gray-50
        to-green-50
        px-4
        sm:px-6
        md:px-8
        lg:px-12
        xl:px-16
        pt-14
        sm:pt-16
        md:pt-20
        lg:pt-24
        pb-12
        sm:pb-14
        md:pb-16
        lg:pb-20
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          flex
          flex-col
          lg:flex-row
          items-center
          justify-center
          gap-10
          md:gap-12
          lg:gap-14
          xl:gap-16
        "
      >

        {/* Image */}
        <div
          className="
            w-full
            lg:w-[45%]
            flex
            justify-center
            lg:justify-start
            order-2
            lg:order-1
          "
        >
          <div
            className="
              relative
              w-full
              max-w-[300px]
              sm:max-w-[360px]
              md:max-w-[430px]
              lg:max-w-[470px]
              xl:max-w-[520px]

              h-[250px]
              sm:h-[300px]
              md:h-[350px]
              lg:h-[390px]
              xl:h-[430px]

              overflow-hidden
              shadow-lg
              md:shadow-xl

              -rotate-2
              hover:rotate-0

              rounded-[40%_60%_70%_30%/40%_50%_60%_60%]

              transition-transform
              duration-700
            "
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <img
              src="/website.png"
              alt="ShineSpec services"
              className="
                w-full
                h-full
                object-cover
                transform
                hover:scale-105
                transition-transform
                duration-700
              "
            />
          </div>
        </div>

        {/* Content */}
        <div
          className="
            w-full
            lg:w-[55%]
            max-w-2xl
            flex
            flex-col
            items-center
            lg:items-start
            text-center
            lg:text-left
            order-1
            lg:order-2
          "
        >

          {/* Heading */}
          <div
            className="w-full"
            data-aos="fade-left"
          >
            <h2
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                lg:text-4xl
                xl:text-5xl
                leading-tight
                font-normal
                text-gray-900
              "
            >
              Agency{" "}
              <span className="font-bold text-black">
                Overview<span className="text-blue-500">.</span>
              </span>
            </h2>

            {/* Dots */}
            <div
              className="
                flex
                gap-2
                sm:gap-2.5
                mt-3
                sm:mt-4
                justify-center
                lg:justify-start
              "
            >
              <Circle className="text-pink-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <Circle className="text-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <Circle className="text-green-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Description */}
          <p
            className="
              w-full
              mt-5
              sm:mt-6
              text-sm
              sm:text-base
              md:text-[17px]
              text-gray-800
              leading-relaxed
            "
            data-aos="fade-left"
            data-aos-delay="100"
          >
            ShineSpec is an AI-powered service platform that makes booking
            professional services faster, smarter, and more reliable. Using
            artificial intelligence, ShineSpec understands what clients need,
            automatically identifies the right service type, estimates the
            work required, and matches each booking with the most suitable
            service provider based on skills, experience, location,
            availability, and performance history.
          </p>

          {/* Feature Cards */}
          <div
            className="
              w-full
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              md:gap-5
              mt-6
              sm:mt-7
              md:mt-8
            "
            data-aos="fade-up"
            data-aos-delay="200"
          >

            {/* Expert Team */}
            <div
              className="
                bg-white
                p-4
                sm:p-5
                md:p-6
                rounded-xl
                md:rounded-2xl
                border
                border-gray-100
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  md:w-11
                  md:h-11
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-pink-100
                  mb-3
                "
              >
                <Users
                  className="
                    text-pink-600
                    w-4
                    h-4
                    sm:w-5
                    sm:h-5
                    md:w-6
                    md:h-6
                  "
                />
              </div>

              <h3
                className="
                  text-sm
                  sm:text-base
                  md:text-lg
                  font-semibold
                  text-gray-800
                  mb-1.5
                  md:mb-2
                "
              >
                Expert Team
              </h3>

              <p
                className="
                  text-gray-700
                  text-xs
                  sm:text-sm
                  leading-relaxed
                "
              >
                Our team carefully screens and connects skilled house
                cleaners, caregivers, and nannies, ensuring families receive
                dependable and professional service.
              </p>
            </div>

            {/* Mission */}
            <div
              className="
                bg-white
                p-4
                sm:p-5
                md:p-6
                rounded-xl
                md:rounded-2xl
                border
                border-gray-100
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  md:w-11
                  md:h-11
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-yellow-100
                  mb-3
                "
              >
                <Target
                  className="
                    text-yellow-600
                    w-4
                    h-4
                    sm:w-5
                    sm:h-5
                    md:w-6
                    md:h-6
                  "
                />
              </div>

              <h3
                className="
                  text-sm
                  sm:text-base
                  md:text-lg
                  font-semibold
                  text-gray-800
                  mb-1.5
                  md:mb-2
                "
              >
                Our Mission
              </h3>

              <p
                className="
                  text-gray-700
                  text-xs
                  sm:text-sm
                  leading-relaxed
                "
              >
                We aim to make it simple and safe for families to find trusted
                help while empowering local workers with stable and rewarding
                job opportunities.
              </p>
            </div>
          </div>

          {/* Learn More */}
          <div
            className="
              flex
              justify-center
              lg:justify-start
              mt-6
              sm:mt-7
              md:mt-8
            "
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Link to="/about">
              <button
                className="
                  px-5
                  sm:px-6
                  md:px-7
                  py-2.5
                  sm:py-3
                  bg-pink-500
                  hover:bg-pink-600
                  text-white
                  rounded-full
                  font-medium
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  duration-300
                  flex
                  items-center
                  gap-2
                  text-xs
                  sm:text-sm
                  md:text-base
                "
              >
                Learn More About Us

                <ArrowRight
                  className="
                    w-4
                    h-4
                    sm:w-4.5
                    sm:h-4.5
                    md:w-5
                    md:h-5
                  "
                />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;