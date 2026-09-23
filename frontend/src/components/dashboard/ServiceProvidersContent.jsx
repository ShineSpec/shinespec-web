import React from "react";

const ServiceProvidersContent = ({ onBookNow }) => {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Your Service providers
      </h2>

      {/* Empty state card */}
      <div className="border border-gray-200 rounded-lg p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Service providers Found
        </h3>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          It looks like you haven’t booked any Service providers yet. Book your first
          Service provider today:
        </p>

        <button
          onClick={onBookNow}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full transition-colors duration-200"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceProvidersContent;
