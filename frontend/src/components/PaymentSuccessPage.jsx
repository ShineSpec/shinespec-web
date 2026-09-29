import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Check,
  Home,
  Calendar,
  MapPin,
  User,
  Clock,
  Printer,
  Mail,
  Phone,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';
import { getAuthToken } from '../lib/auth';

const REDIRECT_SECONDS = 60; // was 10 — gave people almost no time to read details

const PaymentSuccessPage = () => {
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reference, setReference] = useState(null);
  const [paid, setPaid] = useState(false);
  const [stillPending, setStillPending] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Poll the read-only status endpoint until the webhook has confirmed payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('m_payment_id');

    if (!ref) {
      setError('No payment reference found');
      setLoading(false);
      return;
    }
    setReference(ref);

    const MAX_TRIES = 12; // ~60 seconds at 5s intervals
    let tries = 0;
    let cancelled = false;
    let timer;

    const check = async () => {
      tries += 1;
      try {
        const token = await getAuthToken(); // fresh or still-valid Clerk token
        if (!token) throw new Error('not signed in yet'); // Clerk still loading: retry
        const res = await fetch(
          `${API_BASE_URL}/api/payments/payfast/verify?reference=${encodeURIComponent(ref)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (res.ok && data.success) {
          setBooking(data.booking);
          setPaid(true);
          setLoading(false);
          return;
        }
        if (res.ok && data.status === 'failed') {
          setError('Your payment was not completed.');
          setLoading(false);
          return;
        }
        if ([400, 403, 404].includes(res.status)) {
          setError(data.message || 'Payment verification failed');
          setLoading(false);
          return;
        }
        // otherwise: still pending (or a transient 401/500): try again
      } catch (err) {
        console.error('Payment status error:', err);
      }

      if (tries >= MAX_TRIES) {
        setStillPending(true);
        setLoading(false);
        return;
      }
      timer = setTimeout(check, 5000);
    };

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Countdown + redirect only once payment is actually confirmed, and only
  // while the user hasn't opted out of the auto-redirect
  useEffect(() => {
    if (!paid || !autoRedirect) return;
    const timer = setInterval(() => setCountdown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(timer);
  }, [paid, autoRedirect]);

  useEffect(() => {
    if (paid && autoRedirect && countdown === 0) window.location.href = '/dashboard';
  }, [paid, autoRedirect, countdown]);

  const cancelAutoRedirect = () => setAutoRedirect(false);

  // ===== STILL PENDING =====
  if (stillPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            We're still confirming your payment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Your bank can take a few minutes. Your booking will be confirmed automatically as soon as
            PayFast notifies us, and you don't need to pay again.
          </p>
          {reference && (
            <p className="text-xs sm:text-sm text-gray-500 mb-6 break-all">
              Reference: <span className="font-mono font-bold">{reference}</span>
            </p>
          )}
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold text-sm sm:text-base"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="relative mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h3>
          <p className="text-sm sm:text-base text-gray-600">Please wait while we confirm your transaction...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR =====
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
            <p className="text-sm sm:text-base text-gray-600">{error}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-xs sm:text-sm text-yellow-800 break-words">
              If you believe this is an error, please contact our support team with your payment reference:{' '}
              <span className="font-mono font-bold">{reference}</span>
            </p>
          </div>

          <button
            onClick={() => (window.location.href = '/contact')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all font-semibold text-sm sm:text-base"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  // ===== SUCCESS =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center p-4 sm:p-6 py-8 sm:py-10">
      <div className="max-w-3xl w-full">
        {/* Main Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-4 sm:mb-6">
          {/* Animated Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-white rounded-full animate-pulse delay-75"></div>
            </div>

            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-400 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-[bounce_1s_ease-in-out]">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" strokeWidth={2.5} />
              </div>
              <div className="absolute top-2 right-1/3 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-1/3 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-pulse delay-100"></div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-green-100 text-base sm:text-lg">Your booking has been confirmed</p>
            <p className="text-green-50 text-xs sm:text-sm mt-2">Thank you for choosing ShineSpec</p>
          </div>

          {/* Payment Details */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Payment Info Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-green-700 font-medium">Payment Confirmed</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-900">
                      R{booking?.totalCost?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
                {reference && (
                  <div className="sm:text-right">
                    <p className="text-xs text-green-600 mb-1">Transaction ID</p>
                    <p className="text-xs sm:text-sm font-mono font-bold text-green-900 break-all">
                      {reference.slice(-8).toUpperCase()}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-green-200">
                <div>
                  <p className="text-xs text-green-600 mb-1">Payment Method</p>
                  <p className="text-xs sm:text-sm font-semibold text-green-900 capitalize">
                    {booking?.payment?.method?.replace('_', ' ') || 'Card Payment'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-600 mb-1">Date & Time</p>
                  <p className="text-xs sm:text-sm font-semibold text-green-900">
                    {booking?.payment?.paidAt
                      ? new Date(booking.payment.paidAt).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : new Date().toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            {booking && (
              <>
                <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-900">Booking Details</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Service Location</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                        {booking.address?.formattedAddress || 'Address not available'}
                      </p>
                      {booking.address?.unitNumber && (
                        <p className="text-xs sm:text-sm text-gray-600">Unit: {booking.address.unitNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Service Type</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{booking.serviceType}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{booking.hoursNeeded} hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Scheduled Date & Time</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.scheduledDate
                          ? new Date(booking.scheduledDate).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'Date not available'}
                      </p>
                      {booking.scheduledTime && (
                        <p className="text-xs sm:text-sm text-gray-600">{booking.scheduledTime}</p>
                      )}
                    </div>
                  </div>

                  {booking.assignedWorker && (
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Service Provider</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          {booking.assignedWorker.fullName || 'Assigned by our team'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* What's Next */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-900 mb-2 sm:mb-3 text-base sm:text-lg">What happens next?</p>
                  <ul className="space-y-2 text-blue-800 text-xs sm:text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>You'll receive a confirmation email within 5 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Our team will contact you to confirm final details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Your service provider will arrive at the scheduled time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Manage your booking anytime from your dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              <button
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Go to Dashboard
              </button>

              <button
                onClick={handlePrint}
                className="border-2 border-gray-300 text-gray-700 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                Print Receipt
              </button>
            </div>

            {/* Auto Redirect Notice — now cancellable, and gives 30s instead of 10s */}
            {autoRedirect && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-600">
                        {countdown}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">Redirecting to dashboard</p>
                      <p className="text-[11px] sm:text-xs text-gray-600">Automatically in {countdown} seconds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={cancelAutoRedirect}
                      className="text-gray-500 hover:text-gray-700 font-medium text-xs sm:text-sm hover:underline flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Stay here
                    </button>
                    <button
                      onClick={handleGoToDashboard}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm hover:underline flex items-center gap-1"
                    >
                      Go Now
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support Footer */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-3">Need help with your booking?</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
            <a
              href="mailto:support@shinespec.com"
              className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a
              href="tel:+27123456789"
              className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;