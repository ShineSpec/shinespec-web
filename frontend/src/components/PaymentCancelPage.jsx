import React, { useEffect, useState } from 'react';
import { 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  RefreshCw, 
  Home,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

const PaymentCancelPage = () => {
  const [countdown, setCountdown] = useState(10);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Extract booking ID from URL if present
    const params = new URLSearchParams(window.location.search);
    const id = params.get('booking_id') || params.get('m_payment_id');
    if (id) {
      // Extract booking ID from reference format: booking_ID_timestamp
      const match = id.match(/booking_([a-f0-9]+)_/);
      setBookingId(match ? match[1] : null);
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      // Always redirect to booking page to retry payment
      window.location.href = '/services';
    }
  }, [countdown]);

  const handleRetryPayment = () => {
    // Redirect to booking page to continue/retry
    window.location.href = '/services';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleContactSupport = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 mt-20">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with animated icon */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center relative overflow-hidden">

            {/* Icon */}
            <div className="relative mb-4">
              <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl">
                <XCircle className="w-14 h-14 text-red-500" strokeWidth={2.5} />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-red-400 rounded-full animate-ping opacity-20"></div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Cancelled
            </h1>
            <p className="text-red-100 text-lg">
              Your payment was not completed
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Info Message */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-orange-900 mb-2 text-lg">
                    What happened?
                  </h3>
                  <p className="text-orange-800 text-sm leading-relaxed mb-3">
                    You cancelled the payment process or closed the payment window before completing the transaction. 
                    Your booking has been saved and is waiting for payment.
                  </p>
                  <p className="text-orange-800 text-sm font-semibold">
                    Don't worry - no charges were made to your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            {bookingId && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Booking Reference</p>
                    <p className="text-blue-900 font-mono font-bold">{bookingId}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">What would you like to do?</h3>
              <div className="space-y-3">
                <button
                  onClick={handleRetryPayment}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold flex items-center justify-between group shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Try Payment Again</p>
                      <p className="text-xs text-blue-100">Complete your booking payment</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleGoHome}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Home className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Return to Home</p>
                      <p className="text-xs text-gray-500">Browse our services</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleContactSupport}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Contact Support</p>
                      <p className="text-xs text-gray-500">We're here to help</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Auto Redirect Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600">
                      {countdown}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Auto-redirecting</p>
                    <p className="text-xs text-gray-600">Redirecting in {countdown} seconds</p>
                  </div>
                </div>
                <button
                  onClick={handleRetryPayment}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
                >
                  Redirect Now
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-3">Need assistance?</p>
              <div className="flex justify-center gap-4">
                <a
                  href="mailto:support@shinespec.com"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="tel:+27123456789"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  Call Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Your booking is still saved. You can complete payment anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;