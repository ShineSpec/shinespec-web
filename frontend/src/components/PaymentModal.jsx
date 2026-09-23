import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Loader,
  Check,
  AlertCircle,
  Lock,
  ArrowLeft
} from 'lucide-react';
import SnapScanPayment from './SnapScanPayment';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  bookingId, 
  totalAmount, 
  onPaymentSuccess,
  payfastMerchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100'
}) => {
  // ============================================
  // STATE VARIABLES
  // ============================================
  const [step, setStep] = useState('method'); 
  // 'method' | 'processing' | 'inline-payment' | 'success' | 'error'
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [token, setToken] = useState(null);
  const [paymentComponent, setPaymentComponent] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PAYFAST_MERCHANT_ID = payfastMerchantId;

  // ============================================
  // EFFECTS
  // ============================================
  
  // Get token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  // Fetch payment methods when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
      // Reset state when opening
      setStep('method');
      setError('');
      setSelectedMethod(null);
      setPaymentComponent(null);
    }
  }, [isOpen]);

  // Add a function to handle close properly
  const handleClose = () => {
    // Only prevent closing during actual form submission to PayFast
    if (step === 'processing') {
      // Don't allow closing during redirect
      return;
    }
    
    if (step === 'inline-payment') {
      // For inline payments, ask for confirmation
      if (confirm('Closing will cancel your payment. Are you sure?')) {
        handleRetry();
        onClose();
      }
    } else {
      // For other steps, allow closing
      handleRetry();
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && step !== 'processing') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, step]);

  // ============================================
  // API CALLS
  // ============================================

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments/methods`);
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.methods);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Failed to load payment methods');
    }
  };

  const handlePaymentMethodSelect = async (method) => {
    setSelectedMethod(method.id);
    setLoading(true);
    setError('');

    try {
      // Get user email
      const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!userRes.ok) throw new Error('Failed to fetch user info');
      const user = await userRes.json();

      // Initialize payment with backend
      console.log('Calling payment initialization...');
      
      const res = await fetch(`${API_BASE_URL}/api/payments/payfast/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          email: user.email,
          paymentMethod: method.id
        })
      });

      console.log('Payment init response status:', res.status);
      const data = await res.json();

      console.log('Payment init response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Payment initialization failed');
      }

      // Process payment - data now contains redirectUrl
      processPayment(method.id, data, data.reference);

    } catch (err) {
      console.error('Payment initialization error:', err);
      setLoading(false);
      setError(err.message || 'Failed to initialize payment');
      setStep('error');
    }
  };

  const submitPayFastForm = (paymentData) => {
    setStep('processing');
  
    setTimeout(() => {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.payfast.co.za/eng/process";
  
      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
  
      document.body.appendChild(form);
      form.submit();
    }, 300);
  };

  // ✅ Process different payment methods
  // Replace the processPayment function:

const processPayment = (methodId, payData, reference) => {
  switch (methodId) {
    case 'snapscan':
      // Show inline SnapScan payment
      setPaymentComponent(
        <SnapScanPayment
          merchantId={PAYFAST_MERCHANT_ID}
          amount={totalAmount}
          bookingId={bookingId}
          token={token}
          reference={reference}
          onPaymentVerified={(booking) => {
            setStep('success');
            setTimeout(() => {
              onPaymentSuccess?.();
              onClose();
            }, 2000);
          }}
        />
      );
      setStep('inline-payment');
      setLoading(false);
      break;

    case 'credit_card':
    case 'instant_eft':
    case 'samsung_pay':
      // All these methods use PayFast redirect
      submitPayFastForm(payData.paymentData);
      break;

    default:
      setLoading(false);
      setError('Unknown payment method');
      setStep('error');
  }
};

  const handleRetry = () => {
    setStep('method');
    setSelectedMethod(null);
    setError('');
    setPaymentData(null);
    setPaymentComponent(null);
    setLoading(false);
  };

  if (!isOpen) return null;

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

const renderMethodSelection = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
    
    <div className="space-y-3">
      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Loading payment methods...</p>
        </div>
      ) : (
        paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handlePaymentMethodSelect(method)}
            disabled={loading || !method.enabled}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
            } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-blue-300 transition-all">
                <img
                  src={method.icon}
                  alt={method.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              <div className="text-left">
                <p className="font-semibold text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
            {selectedMethod === method.id && loading && (
              <Loader className="w-5 h-5 animate-spin text-blue-600 flex-shrink-0" />
            )}
          </button>
        ))
      )}
    </div> 

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-semibold text-blue-900 mb-1">Secure Payment</p>
        <p className="text-blue-800">
          Your payment is encrypted and processed securely through PayFast, South Africa's leading payment gateway.
        </p>
      </div>
    </div>
  </div>
);

  //renderProcessing function:

const renderProcessing = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
      <Lock className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
    </div>
    
    <div className="text-center max-w-md">
      <p className="text-gray-900 font-bold text-xl mb-2">Processing Payment...</p>
      <p className="text-sm text-gray-600 mb-4">
        You will be redirected to PayFast to complete your payment securely.
      </p>
      
      {/* Payment method info */}
      {selectedMethod && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-900 font-medium">
            {selectedMethod === 'credit_card' && 'Credit/Debit Card'}
            {selectedMethod === 'instant_eft' && 'Instant EFT'}
            {selectedMethod === 'samsung_pay' && 'Samsung Pay'}
          </span>
        </div>
      )}
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800 font-medium">
          ⚠️ Do not close this window or go back during the transaction
        </p>
      </div>
    </div>
  </div>
);

  const renderInlinePayment = () => (
    <div>
      {paymentComponent}
    </div>
  );

  // Replace the renderSuccess function:

const renderSuccess = () => (
  <div className="text-center py-12">
    <div className="relative w-20 h-20 mx-auto mb-6">
      {/* Animated success circle */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
    </div>
    
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! </h3>
    <p className="text-gray-600 mb-3">
      Your booking has been confirmed and payment processed.
    </p>
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <p className="text-sm text-green-700 font-medium">
        Transaction ID: {paymentData?.reference || 'Processing...'}
      </p>
    </div>
    <p className="text-xs text-gray-500 mt-4">
      Redirecting to confirmation page...
    </p>
  </div>
);

  const renderError = () => (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-900">Payment Failed</p>
          <p className="text-sm text-red-800 mt-1">{error}</p>
        </div>
      </div>
      <button
        onClick={handleRetry}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Try Another Method
      </button>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close if clicking on backdrop (not the modal content)
        if (e.target === e.currentTarget && step !== 'processing') {
          handleClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Payment</h2>
          <button
            onClick={handleClose}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-all ${
              step === 'processing' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={step === 'processing'}
            title={step === 'processing' ? 'Please wait while we process your payment' : 'Close'}
            aria-label="Close payment modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Amount Display */}

{/* Amount Display */}
<div className="px-6 py-5 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-b-2 border-blue-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-blue-600 font-semibold mb-1">Total Amount</p>
      <p className="text-4xl font-bold text-blue-900">
        R{totalAmount.toFixed(2)}
      </p>
    </div>
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-200">
      <CreditCard className="w-8 h-8 text-blue-600" />
    </div>
  </div>
  
  {selectedMethod && (
    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-full">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <span className="text-xs text-blue-900 font-medium">
        {paymentMethods.find(m => m.id === selectedMethod)?.name || 'Payment method selected'}
      </span>
    </div>
  )}
</div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && renderMethodSelection()}
          {step === 'processing' && renderProcessing()}
          {step === 'inline-payment' && renderInlinePayment()}
          {step === 'success' && renderSuccess()}
          {step === 'error' && renderError()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;