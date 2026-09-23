import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, User, Phone, AlertCircle, CheckCircle,
  XCircle, Eye, FileText, ChevronRight, DollarSign, MessageSquare, Navigation
} from "lucide-react";
import { useToast } from "../Toast";
import { formatErrorMessage } from "../../utils/errorFormatter";

const WorkerTasksContent = ({ workerData, onUpdate }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const toast = useToast();

  useEffect(() => {
    fetchWorkerBookings();
  }, [token]);

  const fetchWorkerBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workers/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        throw new Error("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
      toast.error(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workers/booking/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Booking ${newStatus} successfully!`);
        setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        setSelectedBooking(null);
        onUpdate?.();
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(formatErrorMessage(err));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-50 border-yellow-200 text-yellow-800",
      confirmed: "bg-blue-50 border-blue-200 text-blue-800",
      "in-progress": "bg-purple-50 border-purple-200 text-purple-800",
      completed: "bg-green-50 border-green-200 text-green-800",
      cancelled: "bg-red-50 border-red-200 text-red-800",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      "in-progress": <AlertCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || icons.pending;
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === "all" || b.status === filter;
    const matchesSearch = !searchQuery || 
      b.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address?.formattedAddress?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    "in-progress": bookings.filter(b => b.status === "in-progress").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full lg:mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Tasks</h2>
          <p className="text-gray-600 mt-1">Manage and track your bookings</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none w-full sm:w-64"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {["all", "pending", "confirmed", "in-progress", "completed"].map(status => {
          const count = statusCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                filter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="capitalize">{status.replace("-", " ")}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                filter === status ? "bg-white text-blue-600" : "bg-gray-300 text-gray-800"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBookings.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No {filter === "all" ? "" : filter} tasks found</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new bookings</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div
              key={booking._id}
              className={`bg-white border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                getStatusColor(booking.status).split(' ')[0]
              }`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(booking.status).split(' ')[0]}`}>
                    {getStatusIcon(booking.status)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{booking.serviceType}</h3>
                    <p className="text-sm text-gray-600">{booking.hoursNeeded} hours</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("-", " ")}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} @ {booking.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{booking.address?.formattedAddress}</span>
                </div>
                {booking.totalCost && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                    <span>R{booking.totalCost.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-4 text-gray-900">Service Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Service Type</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.hoursNeeded} hours</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedBooking.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Time</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.scheduledTime}</p>
                  </div>
                  {selectedBooking.totalCost && (
                    <div className="col-span-2">
                      <p className="text-gray-600 mb-1">Total Cost</p>
                      <p className="font-bold text-green-700 text-lg">R{selectedBooking.totalCost.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedBooking.address?.formattedAddress}</p>
                  {selectedBooking.address?.unitNumber && (
                    <p className="text-sm text-gray-600 mt-1">Unit: {selectedBooking.address.unitNumber}</p>
                  )}
                  <button className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Navigation className="w-4 h-4" />
                    Open in Maps
                  </button>
                </div>
              </div>

              {/* Custom Tasks */}
              {selectedBooking.customTasks?.length > 0 && (
                <div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900">Additional Tasks</h4>
                  <div className="space-y-2">
                    {selectedBooking.customTasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h4 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Special Instructions
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-6 space-y-3">
                {selectedBooking.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking._id, "confirmed");
                      }}
                      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Booking
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to decline this booking?")) {
                          updateBookingStatus(selectedBooking._id, "cancelled");
                        }
                      }}
                      className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold"
                    >
                      Decline Booking
                    </button>
                  </>
                )}

                {selectedBooking.status === "confirmed" && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking._id, "in-progress")}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Start Work
                  </button>
                )}

                {selectedBooking.status === "in-progress" && (
                  <button
                    onClick={() => {
                      if (confirm("Mark this booking as completed?")) {
                        updateBookingStatus(selectedBooking._id, "completed");
                      }
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerTasksContent;

