import { ArrowRight, Users, Home, Heart, CheckCircle, Circle } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Services = () => {
  const [activeService, setActiveService] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [fadeState, setFadeState] = useState('visible');
  const intervalRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  const services = [
    {
      id: 1,
      icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Full-time Housekeeper",
      desc: "Our verified and reliable cleaners help keep your home spotless, using safe cleaning methods and eco-friendly products. We make it easy to maintain a clean and healthy environment for your family.",
      features: [
        "Trained & verified cleaners",
        "Flexible scheduling",
        "Eco-friendly cleaning supplies",
        "Deep cleaning options",
      ],
      color: "bg-pink-500",
      butColor: "bg-pink-500 hover:bg-pink-600",
      iconColor: "text-pink-100",
      image: "/cleaning-2.jpeg",
    },
    {
      id: 2,
      icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Full-time Elder Care",
      desc: "Our caregivers provide trusted assistance for seniors and individuals who need extra help. We ensure every client receives the care, patience, and respect they deserve just like family would provide.",
      features: [
        "Experienced caregivers",
        "Personalized care plans",
        "24/7 availability",
        "Trustworthy & background-checked staff",
      ],
      color: "bg-blue-500",
      butColor: "bg-blue-500 hover:bg-blue-600",
      iconColor: "text-blue-100",
      image: "/towels.png",
    },
    {
      id: 3,
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Full-time Nanny",
      desc: "Our nannies are caring, dependable, and trained to support your child's safety and development. Whether full-time or part-time, we match families with the right nanny for their specific needs.",
      features: [
        "Trusted childcare professionals",
        "Flexible work arrangements",
        "Early childhood support",
        "Safe and nurturing environment",
      ],
      color: "bg-green-500",
      butColor: "bg-green-500 hover:bg-green-600",
      iconColor: "text-green-100",
      image: "/toddler.png",
    },
  ];

  const slideshowImages = [
    { src: "/balcony-cleaning.png", name: "Balcony Cleaning" },
    { src: "/bathroom-cleaning.png", name: "Bathroom Cleaning" },
    { src: "/kitchen-cleaning.png", name: "Kitchen Cleaning" },
    { src: "/office-cleaning.png", name: "Office Cleaning" },
    { src: "/moving-cleaning.png", name: "Moving Cleaning" },
    { src: "/laundry-cleaning.png", name: "Laundry Cleaning" },
  ];

  // Auto-rotate services
  useEffect(() => {
    if (isAutoRotating) {
      intervalRef.current = setInterval(() => {
        setActiveService((prev) => {
          const nextId = prev === services.length ? 1 : prev + 1;
          setFadeState('hidden');
          setTimeout(() => {
            setFadeState('visible');
          }, 300);
          return nextId;
        });
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, services.length]);

  // Smooth transition function
  const changeService = (newServiceId) => {
    if (typeof newServiceId === 'function') {
      newServiceId = newServiceId(activeService);
    }
    
    if (newServiceId !== activeService) {
      setFadeState('hidden');
      setTimeout(() => {
        setActiveService(newServiceId);
        setFadeState('visible');
      }, 300);
    }
  };

  // Handle manual service selection
  const handleServiceClick = (serviceId) => {
    changeService(serviceId);
    setIsAutoRotating(false);
    
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Resume auto-rotation after 10 seconds of inactivity
    inactivityTimerRef.current = setTimeout(() => {
      setIsAutoRotating(true);
    }, 10000);
  };

  const currentService = services.find(ser => ser.id === activeService);

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:py-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-center text-center mb-6">
          <div className="flex-1 max-w-2xl mx-auto space-y-6 mb-10 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 font-semibold">
              Our <span className="font-bold text-black">Fulltime-Services</span>
              <span className="text-blue-500">.</span>
            </h2>
            <div className="flex justify-center gap-3 mt-4">
              <Circle className="text-pink-500 w-5 h-5" />
              <Circle className="text-blue-500 w-5 h-5" />
              <Circle className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center">
          {services.map((ser) => (
            <button
              key={ser.id}
              onClick={() => handleServiceClick(ser.id)}
              onMouseEnter={() => setIsAutoRotating(false)}
              onMouseLeave={() => setIsAutoRotating(true)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium flex items-center 
              gap-2 transition-all duration-300 ease-in-out text-sm sm:text-base transform ${
                activeService === ser.id
                  ? `${ser.color} text-white shadow-lg scale-105`
                  : `bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-105`
              }`}
            >
              {ser.icon}
              {ser.title}
            </button>
          ))}
        </div>

        {/* Active Service Display */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 sm:p-8 mb-12 md:mb-16 border border-gray-100 relative overflow-hidden">
          <div 
            className={`flex flex-col lg:flex-row gap-6 md:gap-10 transition-all duration-300 ease-out ${
              fadeState === 'hidden' 
                ? 'opacity-0 transform translate-y-4' 
                : 'opacity-100 transform translate-y-0'
            }`}
          >
            {/* Text Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center ${currentService.color} bg-opacity-10`}>
                  <div className={currentService.iconColor}>{currentService.icon}</div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {currentService.title}
                </h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                {currentService.desc}
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {currentService.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={() => {
                    if (currentService.id === 1) {
                      window.location.href = "/fulltime-help/hire-housekeeper";
                    } else if (currentService.id === 2) {
                      window.location.href = "/fulltime-help/hire-carer";
                    } else if (currentService.id === 3) {
                      window.location.href = "/fulltime-help/hire-nanny";
                    }
                  }}
                  className={`px-6 py-3 sm:px-8 ${currentService.butColor} text-white rounded-full font-medium transition-all 
                    shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base`}
                >
                  Get This Service
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 mt-6 lg:mt-0">
              <div className="w-full h-60 sm:h-72 md:h-80 overflow-hidden shadow-lg rounded-xl md:rounded-2xl">
                <img
                  src={currentService.image}
                  alt={currentService.title}
                  className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slideshow Section */}
        {/*<div className="mt-12 overflow-hidden relative">
          <div className="flex w-max animate-slide items-center">
            {[...slideshowImages, ...slideshowImages].map((img, idx) => (
              <div key={idx} className="flex-shrink-0 w-40 sm:w-52 mx-2">
                <div className="w-full h-40 sm:h-52 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-sm sm:text-base mt-2 text-gray-700 font-medium">
                  {img.name}
                </p>
              </div>
            ))}
          </div>
        </div>*/}
      </div>

      {/* Decorative Circles */}
      <div className="hidden md:block absolute border-2 border-pink-500 bottom-20 left-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full opacity-50"></div>
      <div className="hidden md:block absolute border-2 border-blue-500 top-40 right-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full opacity-50"></div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide {
          display: flex;
          animation: slide 50s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Services;