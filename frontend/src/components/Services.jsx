import { ArrowRight, Users, Home, Heart, CheckCircle, Circle } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [activeService, setActiveService] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

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
      desc: "Our nannies are caring, dependable, and trained to support your child’s safety and development. Whether full-time or part-time, we match families with the right nanny for their specific needs.",
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

  // Images for the bottom slideshow
  const slideshowImages = [
  { src: "/balcony-cleaning.png", name: "Balcony Cleaning" },
  { src: "/bathroom-cleaning.png", name: "Bathroom Cleaning" },
  { src: "/kitchen-cleaning.png", name: "Kitchen Cleaning" },
  { src: "/windows-cleaning.png", name: "Windows Cleaning" },
  { src: "/office-cleaning.png", name: "Office Cleaning" },
  { src: "/moving-cleaning.png", name: "Moving Cleaning" },
  { src: "/laundry-cleaning.png", name: "Laundry Cleaning" },
];

  // Reset transition state when service changes to allow new content to fade in
  useEffect(() => {
    // Reset transition state after a brief delay to allow new content to mount
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeService, isTransitioning]);

  // Auto-rotate services
  useEffect(() => {
    if (isAutoRotating) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveService((prev) => {
            const nextId = prev === services.length ? 1 : prev + 1;
            return nextId;
          });
        }, 250);
      }, 5000); // Change service every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, services.length]);

  // Handle manual service selection
  const handleServiceClick = (serviceId) => {
    if (serviceId !== activeService) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveService(serviceId);
      }, 250);
    }
    setIsAutoRotating(false); // Pause auto-rotation when user manually selects
    
    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoRotating(true);
    }, 10000);
  };


  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:py-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="flex flex-col lg:flex-row items-center justify-center text-center mb-6"
          data-aos="fade-down"
        >
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
        <div
          className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
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
              data-aos="fade-up"
              data-aos-delay={ser.id * 100}
            >
              {ser.icon}
              {ser.title}
            </button>
          ))}
        </div>

        {/* Active Service Display */}
        <div
          className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl
                 p-6 sm:p-8 mb-12 md:mb-16 border border-gray-100 relative overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {services
            .filter((ser) => ser.id === activeService)
            .map((ser) => (
              <div 
                key={ser.id} 
                className={`flex flex-col lg:flex-row gap-6 md:gap-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isTransitioning 
                    ? 'opacity-0 transform translate-y-2 scale-98' 
                    : 'opacity-100 transform translate-y-0 scale-100'
                }`}
              >
                  {/* Text Content */}
                <div className="flex-1">
                  <div
                    className={`flex items-center gap-3 sm:gap-4 sm:mb-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isTransitioning 
                        ? 'opacity-0 transform -translate-x-2' 
                        : 'opacity-100 transform translate-x-0'
                    }`}
                    data-aos="fade-right"
                    data-aos-delay="300"
                  >
                    <div
                      className={`w-12 h-12 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                                        ${ser.color} bg-opacity-10`}
                    >
                      <div className={`${ser.iconColor} transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isTransitioning ? 'scale-90 rotate-6' : 'scale-100 rotate-0'}`}>{ser.icon}</div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {ser.title}
                    </h3>
                  </div>
                  <p
                    className={`text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] delay-100 ${
                      isTransitioning 
                        ? 'opacity-0 transform -translate-x-2' 
                        : 'opacity-100 transform translate-x-0'
                    }`}
                    data-aos="fade-right"
                    data-aos-delay="350"
                  >
                    {ser.desc}
                  </p>

                  {/* Features */}
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] delay-150 ${
                      isTransitioning 
                        ? 'opacity-0 transform translate-y-2' 
                        : 'opacity-100 transform translate-y-0'
                    }`}
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    {ser.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          isTransitioning 
                            ? 'opacity-0 transform translate-x-1' 
                            : 'opacity-100 transform translate-x-0'
                        }`}
                        style={{ transitionDelay: `${200 + idx * 30}ms` }}
                        data-aos="fade-up"
                        data-aos-delay={450 + idx * 50}
                      >
                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`} />
                        <span className="text-gray-700 text-sm sm:text-base">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div
                    className="flex justify-center lg:justify-start"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    <button
                      onClick={() => {
                        if (ser.id === 1) {
                          navigate("/hire-housekeeper");
                        } else if (ser.id === 2) {
                          navigate("/hire-carer");
                        } else if (ser.id === 3) {
                          navigate("/hire-nanny");
                        } else {
                          navigate("/services/booking");
                        }
                      }}
                      className={`px-6 py-3 sm:px-8 ${ser.butColor} text-white rounded-full font-medium transition-all 
                                    shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base`}
                    >
                      Get This Service
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>

                {/* Image */}
                <div
                  className={`flex-1 mt-6 lg:mt-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] delay-100 ${
                    isTransitioning 
                      ? 'opacity-0 transform translate-x-2 scale-98' 
                      : 'opacity-100 transform translate-x-0 scale-100'
                  }`}
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  <div className="w-full h-60 sm:h-72 md:h-80 overflow-hidden shadow-lg rounded-xl md:rounded-2xl">
                    <img
                      src={ser.image}
                      alt={ser.title}
                      className={`object-cover w-full h-full transform transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isTransitioning 
                          ? 'scale-100' 
                          : 'hover:scale-105'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

{/* Slideshow Section */}
<div className="mt-12 overflow-hidden relative">
  <div className="flex w-max animate-slide items-center">
    {/* Original + duplicate for seamless loop */}
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

  {/* Tailwind keyframes for infinite slide */}
  <style jsx>{`
    @keyframes slide {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-slide {
      display: flex;
      animation: slide 50s linear infinite;
    }
  `}</style>
</div>


      </div>

      {/* Decorative Circles */}
      <div
        className="hidden md:block absolute border-2 border-pink-500 bottom-20 left-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full opacity-50"
        data-aos="zoom-in"
        data-aos-delay="700"
      ></div>
      <div
        className="hidden md:block absolute border-2 border-blue-500 top-40 right-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full opacity-50"
        data-aos="zoom-in"
        data-aos-delay="700"
      ></div>

      {/* Tailwind keyframes for slide animation */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide {
          display: flex;
          animation: slide 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Services;
