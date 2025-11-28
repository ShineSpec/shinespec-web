import React from "react";
import { Home, Heart, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FullTimeHelpPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      icon: <Home className="w-8 h-8" />,
      title: "Full-time Housekeeper",
      desc: "Reliable professionals who maintain a clean, organized and healthy home environment for your family.",
      img: "/cleaning-2.jpeg",
      color: "bg-pink-500",
    },
    {
      id: 2,
      icon: <Heart className="w-8 h-8" />,
      title: "Full-time Elder Care",
      desc: "Compassionate caregivers providing daily support, companionship, and specialized care for seniors.",
      img: "/towels.png",
      color: "bg-blue-500",
    },
    {
      id: 3,
      icon: <Users className="w-8 h-8" />,
      title: "Full-time Nanny",
      desc: "Trusted childcare specialists who ensure safety, growth, and nurturing care for your children.",
      img: "/toddler.png",
      color: "bg-green-500",
    },
  ];

  return (
    <section className="pt-32 pb-20 px-6 sm:px-12 lg:px-28 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-12">
        Find <span className="text-blue-600">Full-Time Help</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            {/* Image */}
            <div className="h-48 w-full overflow-hidden">
              <img
                src={service.img}
                className="w-full h-full object-cover transform hover:scale-105 transition-all duration-300"
                alt={service.title}
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${service.color} bg-opacity-10`}>
                  <span className={`${service.color.replace("bg-", "text-")}`}>
                    {service.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
              </div>

              <p className="text-gray-600 leading-relaxed">{service.desc}</p>

              <button
                onClick={() =>
                  navigate("/services/booking", { state: { selectedService: service } })
                }
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
              >
                Hire Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FullTimeHelpPage;
