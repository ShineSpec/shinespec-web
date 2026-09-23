import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServicesSidebar = () => {
  const [activeService, setActiveService] = useState(null);
  const navigate = useNavigate();

  const services = [
    { img: "/Indoor.png", label: "Indoor Services" },
    { img: "/outdoor.png", label: "Outdoor Services" },
    { img: "/office.png", label: "Office Cleaning" },
    { img: "/moving.png", label: "Moving Cleaning" },
    { img: "/laundry.png", label: "Laundry & Ironing" },
    { img: "/mom.png", label: "Mom's Helper" },
    { img: "/elder.png", label: "Elder Care" },
    { img: "/event.png", label: "Event Cleaning" },
  ];

  const handleServiceClick = (service, index) => {
    setActiveService(index);
    // Navigate to booking page with service data
    navigate("/services/booking", { state: { selectedService: service } });
  };

  return (
    <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-auto p-6 mt-20">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Select Service</h3>
      <div className="space-y-3">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => handleServiceClick(service, index)}
            className={`w-full flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border-2 transition-all text-left ${
              activeService === index
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center">
              <img
                src={service.img}
                alt={service.label}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs lg:text-sm font-semibold text-gray-700">
              {service.label}
            </span>
            {activeService === index && (
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServicesSidebar;