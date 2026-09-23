import React from "react";
import { useNavigate } from "react-router-dom";

const AIFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <img src="/ai.png" alt="AI Service Matcher" className="w-8 h-8 object-contain" />,
      title: "AI Service Matcher",
      description: "Describe your needs in plain English, and our AI instantly finds the perfect service for you. No more guessing hours or service types, just tell us what you need!",
      details: [
        "Natural language understanding",
        "Automatic service type detection",
        "Smart time and date extraction",
        "Instant booking form completion"
      ],
      example: "Try saying: 'My house is messy after a party and I need help urgently'",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: <img src="/chatbot.png" alt="AI Chatbot" className="w-8 h-8 object-contain" />,
      title: "AI-Powered Chatbot",
      description: "Get instant help 24/7 with our intelligent assistant. Ask questions, get booking guidance, or learn about our services, all in a friendly conversation.",
      details: [
        "Available anytime, anywhere",
        "Smart follow-up questions",
        "Booking assistance and guidance",
        "General knowledge about ShineSpec"
      ],
      example: "Ask: 'What services do you offer?' or 'How do I book a cleaning?'",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: <img src="/ai-cloud.png" alt="AI Worker Recommendations" className="w-8 h-8 object-contain" />,
      title: "AI Worker Recommendations",
      description: "When you choose 'Find me a worker', our AI analyzes ratings, experience, and reviews to recommend the perfect match for your specific needs with a personalized explanation.",
      details: [
        "Personalized worker matching",
        "Detailed recommendation explanations",
        "Multi-factor analysis (rating, experience, location)",
        "Transparent selection process"
      ],
      example: "Get explanations like: 'Sarah is perfect because of her 98% rating and 150+ successful jobs'",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    }
  ];

  return (
    <section
      id="ai-features"
      className="relative scroll-m-6 overflow-hidden bg-gradient-to-b from-gray-50 to-white py-14 px-4 sm:py-20 md:py-24 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div
          className="text-center mb-10 sm:mb-14 md:mb-16"
          data-aos="fade-down"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight">
            Intelligent Features
            <span className="font-bold text-black block lg:inline">
              {" "}for a{" "}
              <span className="text-blue-500">Smarter Experience</span>
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Experience the future of service booking with our AI-powered features designed to make your life easier and your bookings faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {features.map((feature, index) => {
            const borderColor = index === 0 ? 'hover:border-blue-200' : index === 1 ? 'hover:border-purple-200' : 'hover:border-green-200';
            const exampleBorder = index === 0 ? 'border-blue-200' : index === 1 ? 'border-purple-200' : 'border-green-200';
            
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-transparent ${borderColor} transition-all duration-300 shadow-sm hover:shadow-xl`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Icon Background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Details List */}
                <ul className="space-y-2 mb-4">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient} mt-2 flex-shrink-0`}></div>
                      <span className="text-gray-600 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Example */}
                <div className={`mt-6 p-4 rounded-lg bg-gradient-to-r ${feature.bgGradient} border ${exampleBorder}`}>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Example:</p>
                  <p className="text-sm text-gray-600 italic">"{feature.example}"</p>
                </div>
              </div>
            );
          })}
        </div>


        {/* CTA Section */}
        <div className="text-center mt-12" data-aos="fade-up">
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Ready to experience the future of service booking?
          </p>
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <img src="/ai.png" alt="AI" className="w-5 h-5 object-contain" />
            Try Our AI Features Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;

