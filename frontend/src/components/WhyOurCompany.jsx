import React from "react";
import { Shield, Star, Zap } from "lucide-react";

const WhyOurCompany = () => {
  return (
    <section
      id="company"
      className="
        relative
        w-full
        overflow-hidden
        scroll-m-6
        bg-white
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
      <div className="mx-auto w-full max-w-7xl">

        {/* Heading */}
        <div
          className="
            text-center
            mb-8
            sm:mb-10
            md:mb-12
            lg:mb-14
          "
          data-aos="fade-down"
        >
          <h2
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              lg:text-4xl
              xl:text-5xl
              font-semibold
              text-gray-900
              leading-tight
            "
          >
            Why Choose{" "}
            <span className="font-bold text-black">
              Our Company<span className="text-blue-500">?</span>
            </span>
          </h2>

          <p
            className="
              mt-3
              sm:mt-4
              text-gray-600
              text-sm
              sm:text-base
              max-w-xl
              mx-auto
              leading-relaxed
            "
          >
            We're committed to connecting families with trusted professionals
            who make life easier.
          </p>
        </div>

        {/* Main Grid */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            md:gap-10
            lg:gap-12
            xl:gap-14
            items-stretch
          "
        >

          {/* LEFT — Feature Cards */}
          <div
            className="
              order-2
              lg:order-1
              flex
              flex-col
              gap-4
              sm:gap-5
            "
          >

            {/* Card 1 */}
            <div
              className="
                flex
                items-start
                gap-3
                sm:gap-4
                md:gap-5
                p-4
                sm:p-5
                md:p-6
                bg-white
                rounded-xl
                md:rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
                group
              "
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div
                className="
                  flex-shrink-0
                  w-10
                  h-10
                  sm:w-12
                  sm:h-12
                  md:w-14
                  md:h-14
                  flex
                  items-center
                  justify-center
                  bg-blue-50
                  rounded-lg
                  sm:rounded-xl
                  group-hover:bg-blue-100
                  transition-colors
                "
              >
                <Star
                  className="
                    w-5
                    h-5
                    sm:w-6
                    sm:h-6
                    text-blue-600
                  "
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    text-base
                    sm:text-lg
                    md:text-xl
                    font-bold
                    text-gray-900
                    mb-1
                    sm:mb-1.5
                  "
                >
                  Excellence Guaranteed
                </h3>

                <p
                  className="
                    text-gray-600
                    text-xs
                    sm:text-sm
                    md:text-base
                    leading-relaxed
                  "
                >
                  We ensure only the most qualified and experienced cleaners,
                  nannies, and caregivers are matched with families—guaranteeing
                  dependable and top-quality service every time.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="
                flex
                items-start
                gap-3
                sm:gap-4
                md:gap-5
                p-4
                sm:p-5
                md:p-6
                bg-white
                rounded-xl
                md:rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
                group
              "
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div
                className="
                  flex-shrink-0
                  w-10
                  h-10
                  sm:w-12
                  sm:h-12
                  md:w-14
                  md:h-14
                  flex
                  items-center
                  justify-center
                  bg-green-50
                  rounded-lg
                  sm:rounded-xl
                  group-hover:bg-green-100
                  transition-colors
                "
              >
                <Shield
                  className="
                    w-5
                    h-5
                    sm:w-6
                    sm:h-6
                    text-green-600
                  "
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    text-base
                    sm:text-lg
                    md:text-xl
                    font-bold
                    text-gray-900
                    mb-1
                    sm:mb-1.5
                  "
                >
                  Trust & Reliability
                </h3>

                <p
                  className="
                    text-gray-600
                    text-xs
                    sm:text-sm
                    md:text-base
                    leading-relaxed
                  "
                >
                  Every worker is vetted for skills, background, and
                  reliability, giving clients peace of mind and consistent
                  service they can depend on.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="
                flex
                items-start
                gap-3
                sm:gap-4
                md:gap-5
                p-4
                sm:p-5
                md:p-6
                bg-white
                rounded-xl
                md:rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
                group
              "
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <div
                className="
                  flex-shrink-0
                  w-10
                  h-10
                  sm:w-12
                  sm:h-12
                  md:w-14
                  md:h-14
                  flex
                  items-center
                  justify-center
                  bg-yellow-50
                  rounded-lg
                  sm:rounded-xl
                  group-hover:bg-yellow-100
                  transition-colors
                "
              >
                <Zap
                  className="
                    w-5
                    h-5
                    sm:w-6
                    sm:h-6
                    text-yellow-600
                  "
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    text-base
                    sm:text-lg
                    md:text-xl
                    font-bold
                    text-gray-900
                    mb-1
                    sm:mb-1.5
                  "
                >
                  Innovation Driven
                </h3>

                <p
                  className="
                    text-gray-600
                    text-xs
                    sm:text-sm
                    md:text-base
                    leading-relaxed
                  "
                >
                  We use smart technology to make finding, hiring, and
                  managing domestic services quick, transparent, and
                  convenient for both families and workers.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT — Stats Card */}
          <div
            className="
              order-1
              lg:order-2
              relative
              w-full
            "
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div
              className="
                relative
                h-full
                min-h-[340px]
                sm:min-h-[360px]
                md:min-h-[390px]
                lg:min-h-full
                bg-gradient-to-br
                from-blue-600
                to-blue-700
                rounded-2xl
                sm:rounded-3xl
                p-5
                sm:p-6
                md:p-8
                lg:p-9
                xl:p-10
                text-white
                overflow-hidden
              "
            >

              {/* Background shapes */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                  className="
                    absolute
                    top-0
                    right-0
                    w-36
                    h-36
                    sm:w-48
                    sm:h-48
                    md:w-56
                    md:h-56
                    bg-white
                    rounded-full
                    -translate-y-1/2
                    translate-x-1/2
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-28
                    h-28
                    sm:w-36
                    sm:h-36
                    md:w-44
                    md:h-44
                    bg-white
                    rounded-full
                    translate-y-1/2
                    -translate-x-1/2
                  "
                />
              </div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col h-full">

                {/* Icon */}
                <div
                  className="
                    w-12
                    h-12
                    sm:w-14
                    sm:h-14
                    md:w-16
                    md:h-16
                    rounded-xl
                    sm:rounded-2xl
                    bg-white/20
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    mb-4
                    sm:mb-5
                  "
                >
                  <Star
                    className="
                      w-6
                      h-6
                      sm:w-7
                      sm:h-7
                      md:w-8
                      md:h-8
                    "
                    strokeWidth={2}
                  />
                </div>

                {/* Heading */}
                <h3
                  className="
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    lg:text-3xl
                    xl:text-4xl
                    font-bold
                    leading-tight
                    mb-2
                    sm:mb-3
                  "
                >
                  98% Customer Satisfaction
                </h3>

                {/* Description */}
                <p
                  className="
                    text-blue-50
                    text-sm
                    sm:text-base
                    leading-relaxed
                    max-w-xl
                  "
                >
                  Our dedication to matching families with the right
                  professionals has earned us a growing community of happy
                  clients across South Africa.
                </p>

                {/* Stats */}
                <div
                  className="
                    grid
                    grid-cols-3
                    gap-3
                    sm:gap-4
                    md:gap-6
                    pt-5
                    sm:pt-6
                    mt-5
                    sm:mt-6
                    border-t
                    border-white/20
                  "
                >

                  {/* Stat 1 */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="min-w-0"
                  >
                    <div
                      className="
                        text-xl
                        sm:text-2xl
                        md:text-3xl
                        font-bold
                        mb-1
                      "
                    >
                      500+
                    </div>

                    <div
                      className="
                        text-[10px]
                        sm:text-xs
                        md:text-sm
                        text-blue-50
                        leading-tight
                      "
                    >
                      Jobs Completed
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="min-w-0"
                  >
                    <div
                      className="
                        text-xl
                        sm:text-2xl
                        md:text-3xl
                        font-bold
                        mb-1
                      "
                    >
                      300+
                    </div>

                    <div
                      className="
                        text-[10px]
                        sm:text-xs
                        md:text-sm
                        text-blue-50
                        leading-tight
                      "
                    >
                      Verified Professionals
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    className="min-w-0"
                  >
                    <div
                      className="
                        text-xl
                        sm:text-2xl
                        md:text-3xl
                        font-bold
                        mb-1
                      "
                    >
                      99%
                    </div>

                    <div
                      className="
                        text-[10px]
                        sm:text-xs
                        md:text-sm
                        text-blue-50
                        leading-tight
                      "
                    >
                      Success Rate
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Floating Decoration */}
            <div
              className="
                absolute
                -top-3
                -right-3
                sm:-top-4
                sm:-right-4
                w-16
                h-16
                sm:w-20
                sm:h-20
                md:w-24
                md:h-24
                bg-green-200
                rounded-full
                opacity-20
                blur-2xl
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                -bottom-3
                -left-3
                sm:-bottom-4
                sm:-left-4
                w-20
                h-20
                sm:w-24
                sm:h-24
                md:w-28
                md:h-28
                bg-green-300
                rounded-full
                opacity-20
                blur-2xl
                pointer-events-none
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyOurCompany;