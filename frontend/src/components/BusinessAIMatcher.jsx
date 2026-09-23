import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

// Quick-start prompts so business users immediately see this isn't the
// consumer-facing matcher — same engine, business framing.
const SUGGESTED_PROMPTS = [
  "Prep the boardroom for a 9am client meeting tomorrow",
  "Deep clean our reception area before Friday's open house",
  "Turnover clean for our Airbnb, guests arrive at 3pm",
  "Post-event cleanup for a corporate function this weekend",
];

// Maps the booking engine's service types to the icon set already used on
// the Hero/services flow, so the booking page receives a shape it recognizes.
const SERVICE_IMAGE_MAP = {
  "Office Cleaning": "/office.png",
  "Event Cleaning": "/event.png",
  "Indoor Services": "/Indoor.png",
  "Outdoor Services": "/outdoor.png",
  "Moving Cleaning": "/moving.png",
  "Laundry & Ironing": "/laundry.png",
};

const BusinessAIMatcher = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matched, setMatched] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const handleMatch = async () => {
    if (!description.trim()) {
      setError("Tell us what your business needs help with");
      return;
    }

    setLoading(true);
    setError("");
    setMatched(null);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/auth/ai-service-match`, {
        method: "POST",
        headers,
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to match a service");
      }

      const data = await response.json();
      setMatched(data);
    } catch (err) {
      console.error("Business AI match error:", err);
      setError(err.message || "Couldn't analyze that request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMatch();
    }
  };

  const handleContinue = () => {
    if (!matched) return;

    navigate("/services/booking", {
      state: {
        selectedService: {
          label: matched.serviceType,
          img: SERVICE_IMAGE_MAP[matched.serviceType] || "/office.png",
        },
        aiMatch: matched,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <img src="/ai.png" alt="AI" className="w-6 h-6 object-contain" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Tell us what your business needs</h3>
          <p className="text-sm text-gray-600 mt-1">
            Plain English in, a ready-to-confirm booking out. No forms, no service catalogues to dig through.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setDescription(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setError("");
        }}
        onKeyPress={handleKeyPress}
        placeholder="e.g., Prep the boardroom for a 9am client meeting tomorrow"
        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
        rows="3"
        disabled={loading}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 mt-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {matched && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 font-medium">Here's what we matched:</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pl-6">
            <dt className="text-gray-500">Service</dt>
            <dd className="text-gray-900 font-medium">{matched.serviceType}</dd>
            <dt className="text-gray-500">Estimated time</dt>
            <dd className="text-gray-900 font-medium">{matched.hoursNeeded} hours</dd>
            <dt className="text-gray-500">Priority</dt>
            <dd className="text-gray-900 font-medium capitalize">{matched.urgency}</dd>
            {matched.scheduledDate && (
              <>
                <dt className="text-gray-500">Date</dt>
                <dd className="text-gray-900 font-medium">{matched.scheduledDate}</dd>
              </>
            )}
            {matched.scheduledTime && (
              <>
                <dt className="text-gray-500">Time</dt>
                <dd className="text-gray-900 font-medium">{matched.scheduledTime}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={handleMatch}
          disabled={loading || !description.trim()}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <img src="/ai.png" alt="AI" className="w-4 h-4 object-contain" />
              <span>Match My Request</span>
            </>
          )}
        </button>

        {matched && (
          <button
            onClick={handleContinue}
            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        For retail, industrial, or rental-turnover jobs, our matcher gets you started and our team confirms the details with you directly.
      </p>
    </div>
  );
};

export default BusinessAIMatcher;