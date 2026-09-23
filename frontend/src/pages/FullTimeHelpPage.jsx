import React from "react";
import { Home, Heart, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FullTimeHelpPage = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 1,
      icon: Home,
      title: "Full-time Housekeeper",
      desc: "Reliable professionals who maintain a clean, organized and healthy home environment for your family.",
      img: "/cleaning-2.jpeg",
      color: "bg-pink-500",
      route: "housekeeper",
    },
    {
      id: 2,
      icon: Heart,
      title: "Full-time Elder Care",
      desc: "Compassionate caregivers providing daily support, companionship, and specialized care for seniors.",
      img: "/towels.png",
      color: "bg-blue-500",
      route: "carer",
    },
    {
      id: 3,
      icon: Users,
      title: "Full-time Nanny",
      desc: "Trusted childcare specialists who ensure safety, growth, and nurturing care for your children.",
      img: "/toddler.png",
      color: "bg-green-500",
      route: "nanny",
    },
  ];

  const handleHireNow = (service) => {
    const routeMap = {
      housekeeper: "/fulltime-help/hire-housekeeper",
      carer: "/fulltime-help/hire-carer",
      nanny: "/fulltime-help/hire-nanny"
    };
    navigate(routeMap[service.route]);
  };

  return (
    <section className="pt-28 pb-20 px-5 sm:px-10 lg:px-24 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 text-center mb-4 leading-snug">
          Find <span className="text-blue-600">Full-Time Help</span>
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Discover our trusted network of experienced professionals ready to support your family
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col group"
          >
            {/* Image */}
            <div className="h-48 sm:h-56 w-full overflow-hidden bg-gray-200">
              <img
                src={service.img}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                alt={service.title}
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4 flex-grow">
              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${service.color} bg-opacity-15`}>
                  <service.icon className={`w-7 h-7 text-white`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {service.title}
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-grow">
                {service.desc}
              </p>

              {/* Button */}
              <button
                onClick={() => handleHireNow(service)}
                className="mt-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                Get this service <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose ShineSpec?
          </h3>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600">Successful Placements</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Dedicated Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullTimeHelpPage;