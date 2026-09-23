import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, Info } from "lucide-react";

const CheckStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ensure API_BASE_URL is properly set with fallback
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  
  // Validate that API_BASE_URL is set
  if (!API_BASE_URL) {
    console.error('VITE_API_BASE_URL is not set in environment variables');
  }

  // Add this for debugging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('All env vars:', import.meta.env);
  }

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStatus = async () => {
      // Check if API_BASE_URL is available
      if (!API_BASE_URL) {
        setError("API configuration error. Please contact support.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/workers/my-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Please log in to check your status");
          } else if (res.status === 404) {
            throw new Error("Application not found");
          } else {
            throw new Error("Failed to fetch status");
          }
        }

        const data = await res.json();
        setStatus((data.status || "pending").toLowerCase());
      } catch (err) {
        console.error("Status fetch error:", err);
        setError(err.message || "Failed to load application status");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStatus();
    } else {
      setError("Please log in to check your application status");
      setLoading(false);
    }
  }, [token, API_BASE_URL]);

  const renderStatusIcon = () => {
    switch (status) {
      case "approved":
        return (
          <CheckCircle className="w-20 h-20 text-green-500 drop-shadow-lg animate-bounce" />
        );
      case "rejected":
        return (
          <XCircle className="w-20 h-20 text-red-500 drop-shadow-lg animate-pulse" />
        );
      default:
        return (
          <Clock className="w-20 h-20 text-yellow-500 drop-shadow-lg animate-spin-slow" />
        );
    }
  };

  if (loading) {
    return (
      <section className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <p className="text-gray-700 text-xl font-medium animate-pulse">
          Checking your application status...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-screen bg-gradient-to-br from-red-100 via-white to-orange-100">
        <div className="bg-white p-6 shadow-xl rounded-2xl border border-red-200">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <p className="text-red-600 font-semibold text-center mt-2">
            Error: {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 px-6 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full border border-gray-100 text-center transform transition-all hover:scale-[1.01]">
        
        {/* Badge */}
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            status === "approved"
              ? "bg-green-100 text-green-700"
              : status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status.toUpperCase()}
        </span>

        {/* Icon */}
        <div className="flex justify-center mt-6">{renderStatusIcon()}</div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-gray-800 mt-6 tracking-wide">
          Your Application Status
        </h2>

        {/* Message */}
        <p className="text-gray-600 mt-4 text-lg leading-relaxed">
          {status === "approved" && (
            <>
              🎉 <span className="font-semibold">Congratulations!</span>  
              Your worker profile has been approved.  
              You will start receiving job opportunities soon.
            </>
          )}
          {status === "rejected" && (
            <>
              Your application was not approved.  
              <br />
              You may re-apply or contact support for details.
            </>
          )}
          {status === "pending" && (
            <>
              Your application is still under review by our team.  
              <br />
              Please check again later.
            </>
          )}
        </p>

        {/* Additional Footer Note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Info className="w-4 h-4" />
          <span>We typically respond within 24–48 hours.</span>
        </div>
      </div>
    </section>
  );
};

export default CheckStatus;
