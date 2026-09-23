import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2, Calendar, Repeat, Receipt, Loader2, AlertCircle,
  ArrowLeft, Plus, MapPin, Lock, ArrowRight, User,
} from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Not scheduled";
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
};

const PropertyManagerDashboard = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to load your bookings");
        const data = await response.json();
        setBookings(data || []);
      } catch (err) {
        setError("We couldn't load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [API_BASE_URL, token]);

  // Group bookings by property address
  const propertyGroups = useMemo(() => {
    const groups = {};
    bookings.forEach((booking) => {
      const address = booking.address?.formattedAddress || "Address not specified";
      if (!groups[address]) groups[address] = [];
      groups[address].push(booking);
    });
    return Object.entries(groups).map(([address, items]) => ({
      address,
      bookings: items.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)),
      hasRecurring: items.some((b) => b.frequency && b.frequency !== "one-time"),
      totalSpend: items.filter((b) => b.payment?.status === "paid").reduce((sum, b) => sum + (b.totalCost || 0), 0),
      lastService: items[0]?.serviceType || "",
    }));
  }, [bookings]);

  // ── NOT LOGGED IN ─────────────────────────────────────────
  if (!token || !loggedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-6 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your properties</h2>
          <p className="text-gray-600 text-sm mb-8">
            Your Property Manager Dashboard is tied to your ShineSpec account. All bookings, schedules, and receipts are stored there.
          </p>
          <button
            onClick={() => navigate("/login", { state: { returnTo: "/property-manager" } })}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all mb-3"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup", { state: { returnTo: "/property-manager" } })}
            className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all"
          >
            Create an Account
          </button>
          <Link to="/business-services" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 mt-6 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Business Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 pb-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/business-services" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Business Services
        </Link>

        {/* Header with user context */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl text-gray-900">
              Property <span className="font-bold text-black">Dashboard<span className="text-blue-500">.</span></span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <p className="text-sm text-gray-500">
                Showing bookings for <span className="font-semibold text-gray-700">{loggedInUser.name} {loggedInUser.lastname}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Book a Service
          </button>
        </div>

        {/* Summary strip */}
        {!loading && !error && propertyGroups.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Properties", value: propertyGroups.length },
              { label: "Total Bookings", value: bookings.length },
              { label: "Completed", value: bookings.filter(b => b.status === "completed").length },
              {
                label: "Total Paid",
                value: `R${bookings.filter(b => b.payment?.status === "paid").reduce((s, b) => s + (b.totalCost || 0), 0).toFixed(2)}`
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg max-w-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && propertyGroups.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 text-sm mb-6">
              Book a service and it'll appear here grouped by address.
            </p>
            <button
              onClick={() => navigate("/services")}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all"
            >
              Book Your First Service
            </button>
          </div>
        )}

        {/* Property cards */}
        {!loading && !error && propertyGroups.length > 0 && (
          <div className="space-y-6">
            {propertyGroups.map((group) => (
              <div key={group.address} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Property header */}
                <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{group.address}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        {group.bookings.length} {group.bookings.length === 1 ? "booking" : "bookings"}
                        {group.hasRecurring && (
                          <span className="inline-flex items-center gap-1 text-blue-600">
                            <Repeat className="w-3 h-3" /> Recurring
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="text-xs text-gray-400">{group.lastService}</span>
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-gray-400" />
                      <span>Paid: R{group.totalSpend.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Booking rows */}
                <div className="divide-y divide-gray-50">
                  {group.bookings.map((booking) => (
                    <div key={booking._id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{booking.serviceType}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(booking.scheduledDate)}</span>
                          {booking.scheduledTime && <span>· {booking.scheduledTime}</span>}
                          {booking.frequency && booking.frequency !== "one-time" && (
                            <span className="ml-1 text-blue-500 capitalize">· {booking.frequency}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">R{(booking.totalCost || 0).toFixed(2)}</span>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-600"}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book again for this property */}
                <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => navigate("/services")}
                    className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Book another service for this property <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManagerDashboard;