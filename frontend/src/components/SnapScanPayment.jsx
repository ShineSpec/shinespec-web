import React, { useState, useEffect } from 'react';
import { generateSnapScanQR } from '../utils/qrCodeGenerator';
import { Loader, AlertCircle, Check } from 'lucide-react';

const SnapScanPayment = ({ merchantId, amount, bookingId, token, onPaymentVerified }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const POLL_INTERVAL = 3000; // Check every 3 seconds
  const MAX_POLLS = 600; // 30 minutes max

  // Generate QR code on mount
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qr = await generateSnapScanQR(merchantId, amount);
        setQrCode(qr);
        setLoading(false);
      } catch (err) {
        setError('Failed to generate QR code');
        setLoading(false);
      }
    };

    generateQR();
  }, [merchantId, amount]);

  // Poll for payment verification
  useEffect(() => {
    if (!verified && pollCount < MAX_POLLS) {
      const timer = setTimeout(() => {
        verifyPayment();
      }, POLL_INTERVAL);

      return () => clearTimeout(timer);
    }
  }, [pollCount, verified]);

  const verifyPayment = async () => {
    if (verified || verifying) return;

    try {
      setVerifying(true);
      
      const res = await fetch(
        `${API_BASE_URL}/api/payments/payfast/verify?bookingId=${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (res.ok && data.success && data.booking?.payment?.status === 'paid') {
        setVerified(true);
        onPaymentVerified?.(data.booking);
      } else {
        setPollCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setPollCount(prev => prev + 1);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-gray-600">Generating QR Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-lg font-bold text-green-900">Payment Confirmed!</p>
        <p className="text-sm text-green-700 mt-1">Your booking is now confirmed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* QR Code Display */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center">
        {qrCode && (
          <img
            src={qrCode}
            alt="SnapScan QR Code"
            className="w-48 h-48 mb-4"
          />
        )}
        <p className="text-sm text-center text-gray-600 mb-3">
          Scan this QR code with SnapScan to pay
        </p>
        <p className="text-2xl font-bold text-blue-600 mb-2">
          R{amount.toFixed(2)}
        </p>
      </div>

      {/* Verification Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          {verifying && (
            <Loader className="w-4 h-4 animate-spin text-blue-600" />
          )}
          <p className="text-sm font-semibold text-blue-900">
            {verifying ? 'Verifying payment...' : 'Waiting for payment...'}
          </p>
        </div>
        <p className="text-xs text-blue-800">
          This page will automatically update once payment is confirmed.
          Do not close this page.
        </p>
      </div>

      {/* Manual Verification Button */}
      <button
        onClick={verifyPayment}
        disabled={verifying}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-semibold text-sm"
      >
        {verifying ? 'Checking...' : 'Check Payment Status'}
      </button>
    </div>
  );
};

export default SnapScanPayment;
