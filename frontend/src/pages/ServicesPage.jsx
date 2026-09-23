import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MousePointerClick,
  UserCheck,
  CalendarClock,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const ServicesPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const handleSelect = (service) => {
    navigate("/services/booking", { state: { selectedService: service } });
  };

  const bookingSteps = [
    {
      icon: MousePointerClick,
      title: "Choose a Service",
      description:
        "Browse our range of services above and tap on the one you need — from indoor cleaning to elder care.",
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: CalendarClock,
      title: "Add Your Details",
      description:
        "Enter your address, pick a date and time, choose how many hours you need, and add any special tasks or instructions.",
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      icon: UserCheck,
      title: "Pick Your Worker",
      description:
        "Browse available service providers near you — view their ratings, experience, and profiles, then choose your favourite or let us auto-assign the best match.",
      color: "from-violet-500 to-violet-600",
      bgLight: "bg-violet-50",
      border: "border-violet-200",
    },
    {
      icon: CreditCard,
      title: "Review & Pay",
      description:
        "Check your full booking summary, confirm everything looks good, and pay securely online. You'll receive a confirmation instantly!",
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50",
      border: "border-amber-200",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Services Section */}
      <section className="pt-32 pb-16 px-6 sm:px-12 lg:px-28">
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
              <h3 className="text-gray-800 font-medium text-lg">
                {service.label}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* How to Book Section */}
      <section className="pb-24 px-6 sm:px-12 lg:px-28 mt-10 lg:mt-20">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Simple & Quick
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to Book a <span className="text-blue-600">Service</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Getting professional help is easy. Just follow these five simple
            steps and you'll be all set.
          </p>
        </div>

        {/* Steps - Desktop Timeline */}
        <div className="hidden lg:block max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-rose-200" />

          <div className="grid grid-cols-4 gap-8 relative">
            {bookingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Number + Icon */}
                  <div className="relative mb-5">
                    <div
                      className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.8} />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-100">
                      {index + 1}
                    </div>
                  </div>

                  {/* Text */}
                  <h4 className="font-bold text-gray-900 text-base mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps - Mobile/Tablet Cards */}
        <div className="lg:hidden max-w-lg mx-auto space-y-4">
          {bookingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-4 p-5 rounded-2xl ${step.bgLight} border ${step.border} transition-all duration-300`}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md relative`}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-xs font-bold text-gray-700">
                    {index + 1}
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (except last) */}
                {index < bookingSteps.length - 1 && (
                  <div className="hidden sm:flex items-center self-center">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <div className="inline-flex flex-col items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No hidden fees — pay only for what you book
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
