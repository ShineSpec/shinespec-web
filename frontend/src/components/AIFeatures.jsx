import React from "react";
import { useNavigate } from "react-router-dom";

const AIFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <img
          src="/ai.png"
          alt="AI Service Matcher"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
      ),
      title: "AI Service Matcher",
      description:
        "Describe your needs in plain English, and our AI instantly finds the perfect service for you. No more guessing hours or service types, just tell us what you need!",
      details: [
        "Natural language understanding",
        "Automatic service type detection",
        "Smart time and date extraction",
        "Instant booking form completion",
      ],
      example:
        "Try saying: 'My house is messy after a party and I need help urgently'",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: (
        <img
          src="/chatbot.png"
          alt="AI Chatbot"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
      ),
      title: "AI-Powered Chatbot",
      description:
        "Get instant help 24/7 with our intelligent assistant. Ask questions, get booking guidance, or learn about our services, all in a friendly conversation.",
      details: [
        "Available anytime, anywhere",
        "Smart follow-up questions",
        "Booking assistance and guidance",
        "General knowledge about ShineSpec",
      ],
      example:
        "Ask: 'What services do you offer?' or 'How do I book a cleaning?'",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      icon: (
        <img
          src="/ai-cloud.png"
          alt="AI Worker Recommendations"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
        />
      ),
      title: "AI Worker Recommendations",
      description:
        "When you choose 'Find me a worker', our AI analyzes ratings, experience, and reviews to recommend the perfect match for your specific needs with a personalized explanation.",
      details: [
        "Personalized worker matching",
        "Detailed recommendation explanations",
        "Multi-factor analysis (rating, experience, location)",
        "Transparent selection process",
      ],
      example:
        "Get explanations like: 'Sarah is perfect because of her 98% rating and 150+ successful jobs'",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ];

  return (
    <section
      id="ai-features"
      className="
        relative
        w-full
        overflow-hidden
        scroll-m-6
        bg-gradient-to-b
        from-gray-50
        to-white
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

        {/* =========================
            HEADING
        ========================== */}
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
            Intelligent Features{" "}
            <span className="font-bold text-black">
              for a{" "}
              <span className="text-blue-500">
                Smarter Experience
              </span>
            </span>
          </h2>

          <p
            className="
              mt-3
              sm:mt-4
              text-gray-600
              text-sm
              sm:text-base
              max-w-2xl
              lg:max-w-3xl
              mx-auto
              leading-relaxed
            "
          >
            Experience the future of service booking with our AI-powered
            features designed to make your life easier and your bookings
            faster.
          </p>
        </div>

        {/* =========================
            FEATURES GRID
        ========================== */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-5
            sm:gap-6
            lg:gap-7
          "
        >
          {features.map((feature, index) => {
            const borderColor =
              index === 0
                ? "hover:border-blue-200"
                : index === 1
                ? "hover:border-purple-200"
                : "hover:border-green-200";

            const exampleBorder =
              index === 0
                ? "border-blue-200"
                : index === 1
                ? "border-purple-200"
                : "border-green-200";

            return (
              <div
                key={index}
                className={`
                  group
                  relative
                  flex
                  flex-col
                  bg-white
                  rounded-xl
                  sm:rounded-2xl
                  p-4
                  sm:p-5
                  md:p-6
                  lg:p-6
                  border-2
                  border-transparent
                  ${borderColor}
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                  duration-300
                `}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >

                {/* Icon */}
                <div
                  className={`
                    w-12
                    h-12
                    sm:w-14
                    sm:h-14
                    md:w-15
                    md:h-15
                    rounded-xl
                    sm:rounded-2xl
                    bg-gradient-to-br
                    ${feature.bgGradient}
                    flex
                    items-center
                    justify-center
                    mb-4
                    sm:mb-5
                    group-hover:scale-105
                    transition-transform
                    duration-300
                  `}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="
                    text-lg
                    sm:text-xl
                    md:text-xl
                    font-bold
                    text-gray-900
                    mb-2
                    sm:mb-3
                    leading-snug
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    text-gray-600
                    text-xs
                    sm:text-sm
                    md:text-sm
                    leading-relaxed
                    mb-4
                  "
                >
                  {feature.description}
                </p>

                {/* Details */}
                <ul
                  className="
                    space-y-1.5
                    sm:space-y-2
                    mb-4
                  "
                >
                  {feature.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2"
                    >
                      <div
                        className={`
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-gradient-to-r
                          ${feature.gradient}
                          mt-[6px]
                          flex-shrink-0
                        `}
                      />

                      <span
                        className="
                          text-gray-600
                          text-xs
                          sm:text-sm
                          leading-relaxed
                        "
                      >
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Example */}
                <div
                  className={`
                    mt-auto
                    pt-3
                    sm:pt-4
                    p-3
                    sm:p-4
                    rounded-lg
                    bg-gradient-to-r
                    ${feature.bgGradient}
                    border
                    ${exampleBorder}
                  `}
                >
                  <p
                    className="
                      text-[10px]
                      sm:text-xs
                      font-semibold
                      text-gray-700
                      mb-1
                    "
                  >
                    Example:
                  </p>

                  <p
                    className="
                      text-xs
                      sm:text-sm
                      text-gray-600
                      italic
                      leading-relaxed
                    "
                  >
                    "{feature.example}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================
            CTA
        ========================== */}
        <div
          className="
            text-center
            mt-8
            sm:mt-10
            md:mt-12
          "
          data-aos="fade-up"
        >
          <p
            className="
              text-gray-600
              text-sm
              sm:text-base
              mb-4
              sm:mb-5
            "
          >
            Ready to experience the future of service booking?
          </p>

          <button
            onClick={() => navigate("/services")}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              sm:px-6
              md:px-7
              py-2.5
              sm:py-3
              rounded-xl
              font-semibold
              text-xs
              sm:text-sm
              md:text-base
              shadow-lg
              hover:shadow-xl
              transition-all
              duration-300
              transform
              hover:-translate-y-1
            "
          >
            <img
              src="/ai.png"
              alt="AI"
              className="
                w-4
                h-4
                sm:w-5
                sm:h-5
                object-contain
              "
            />

            Try Our AI Features Now
          </button>
        </div>

      </div>
    </section>
  );
};

export default AIFeatures;