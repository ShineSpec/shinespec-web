import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight, Circle } from "lucide-react";

const highlights = [
  "Office, retail & event cleaning",
  "Airbnb & short-term rental turnovers",
  "Estate agent listing preparation",
  "Refer & Earn - R150 or 10% on 5 bookings",
];

const BusinessCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gray-900 py-14 px-6 md:px-12 lg:px-20">
      {/* subtle background shape */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-400 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left */}
        <div className="flex-1 max-w-xl" data-aos="fade-right">
          <div className="flex gap-3 mb-5">
            <Circle className="text-pink-500 w-4 h-4" />
            <Circle className="text-blue-400 w-4 h-4" />
            <Circle className="text-green-400 w-4 h-4" />
          </div>
          <h2 className="text-3xl sm:text-4xl text-white leading-tight">
            Running a business
            <span className="font-bold block">
              or managing property
              <span className="text-blue-400">?</span>
            </span>
          </h2>
          <p className="text-gray-400 mt-4 leading-relaxed">
            ShineSpec's commercial division keeps offices spotless, turns over
            Airbnb properties on time, and helps estate agents prepare listings
            that impress.
          </p>

          <ul className="mt-6 space-y-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => navigate("/business-services")}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all flex items-center gap-2 shadow-lg"
            >
              <Building2 className="w-4 h-4" />
              Explore Business Services
            </button>
            <button
              onClick={() => navigate("/business-services/refer-earn")}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all"
            >
              Refer & Earn
            </button>
          </div>
        </div>

        {/* Right — stat cards */}
        <div
          className="flex flex-col gap-4 w-full max-w-xs"
          data-aos="fade-left"
          data-aos-delay="150"
        >
          {[
            { value: "40%", label: "of SA cleaning market is commercial" },
            { value: "R150", label: "earned per Quick Cash referral" },
            { value: "10%", label: "on first 5 bookings via commission plan" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
            >
              <span className="text-3xl font-bold text-blue-400">{stat.value}</span>
              <span className="text-sm text-gray-400 leading-snug">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;