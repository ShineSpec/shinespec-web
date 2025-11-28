import React from "react";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    { img: "/Indoor.png", label: "Indoor Services" },
    { img: "/outdoor.png", label: "Outdoor Services" },
    { img: "/office.png", label: "Office Cleaning" },
    { img: "/moving.png", label: "Moving Cleaning" },
    { img: "/laundry.png", label: "Laundry & Ironing" },
    { img: "/mom.png", label: "Mom's Helper" },
    { img: "/elder.png", label: "Elder Care" },
    { img: "/express.png", label: "Express Cleaning" },
  ];

  const handleSelect = (service) => {
    navigate("/services/booking", { state: { selectedService: service } });
  };

  return (
    <section className="pt-32 pb-20 px-6 sm:px-12 lg:px-28 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-12">
        Choose a <span className="text-blue-600">Service</span>
      </h2>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => handleSelect(service)}
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 flex items-center justify-center mb-4">
              <img
                src={service.img}
                alt={service.label}
                className="object-contain w-full h-full"
              />
            </div>
            <h3 className="text-gray-800 font-medium text-lg">{service.label}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;
