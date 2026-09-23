import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  X,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  User
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Booking cancelled successfully');
        fetchBookings();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-sm lg:text-base text-gray-600">Track and manage your service bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 lg:px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm lg:text-base flex-shrink-0 ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </span>
            <span className="sm:hidden">
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase()}
            </span>
            <span className="ml-1 lg:ml-2 text-xs lg:text-sm">
              ({bookings.filter(b => status === 'all' || b.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You haven't made any bookings yet" 
              : `No ${filter} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border-2 border-gray-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate">{booking.serviceType}</h3>
                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="hidden sm:inline">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="sm:hidden">
                        {booking.status.charAt(0).toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="text-xl lg:text-2xl font-bold text-blue-600">R{booking.totalCost}</p>
                  <p className="text-xs lg:text-sm text-gray-500">{booking.hoursNeeded} hours</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-start gap-2 lg:gap-3">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-semibold text-gray-900">Address</p>
                    <p className="text-xs lg:text-sm text-gray-600 break-words">{booking.address.formattedAddress}</p>
                    {booking.address.unitNumber && (
                      <p className="text-xs lg:text-sm text-gray-500">Unit: {booking.address.unitNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2 lg:gap-3">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs lg:text-sm font-semibold text-gray-900">Frequency</p>
                    <p className="text-xs lg:text-sm text-gray-600 capitalize">
                      {booking.frequency.replace('-', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {booking.customTasks && booking.customTasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Custom Tasks</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.customTasks.map((task, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelBooking(booking._id);
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg font-semibold hover:bg-red-100 transition-all"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl lg:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 lg:p-6 rounded-t-xl lg:rounded-t-2xl">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl lg:text-2xl font-bold mb-2 break-words">{selectedBooking.serviceType}</h2>
                  <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1 ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusIcon(selectedBooking.status)}
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all flex-shrink-0"
                >
                  <X className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
              {/* Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Service Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900">{selectedBooking.address.formattedAddress}</p>
                  {selectedBooking.address.unitNumber && (
                    <p className="text-gray-600 text-sm mt-1">Unit: {selectedBooking.address.unitNumber}</p>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedBooking.hoursNeeded} hours</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Frequency</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {selectedBooking.frequency.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                    <p className="text-lg font-semibold text-blue-600">R{selectedBooking.totalCost}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Booked On</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Tasks */}
              {selectedBooking.customTasks && selectedBooking.customTasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Custom Tasks</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.customTasks.map((task, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                      >
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Worker */}
              {selectedBooking.assignedWorker && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Assigned Worker
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900">{selectedBooking.assignedWorker.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedBooking.assignedWorker.phone}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedBooking.status === 'pending' && (
                <button
                  onClick={() => {
                    cancelBooking(selectedBooking._id);
                    setSelectedBooking(null);
                  }}
                  className="w-full px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-all"
                >
                  Cancel This Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;