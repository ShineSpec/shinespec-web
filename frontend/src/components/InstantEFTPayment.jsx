import React, { useState } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';

const InstantEFTPayment = ({ bankingDetails, amount, reference }) => {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-3">Bank Transfer Instructions</h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>Log into your online banking</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>Select "Pay to Bank Account"</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>Enter the account details below</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>Use the reference as your payment description</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">5.</span>
            <span>Verify and confirm the transaction</span>
          </li>
        </ol>
      </div>

      {/* Account Details Card */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
        <h4 className="font-bold text-gray-900 mb-4">Account Details</h4>

        {/* Account Holder */}
        <div>
          <label className="text-xs text-gray-600 font-semibold">Account Holder</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value="ShineSpec Services"
              disabled
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
            />
            <button
              onClick={() => copyToClipboard('ShineSpec Services', 'holder')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {copied === 'holder' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Bank Name */}
        <div>
          <label className="text-xs text-gray-600 font-semibold">Bank</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value="Standard Bank"
              disabled
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
            />
            <button
              onClick={() => copyToClipboard('Standard Bank', 'bank')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {copied === 'bank' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="text-xs text-gray-600 font-semibold">Account Number</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value="123456789"
              disabled
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-mono"
            />
            <button
              onClick={() => copyToClipboard('123456789', 'account')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {copied === 'account' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Branch Code */}
        <div>
          <label className="text-xs text-gray-600 font-semibold">Branch Code</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value="050001"
              disabled
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-mono"
            />
            <button
              onClick={() => copyToClipboard('050001', 'branch')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {copied === 'branch' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Reference */}
        <div>
          <label className="text-xs text-gray-600 font-semibold">Payment Reference</label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1">Use this as your payment description</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={reference}
              disabled
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(reference, 'reference')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {copied === 'reference' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="pt-4 border-t border-gray-200">
          <label className="text-xs text-gray-600 font-semibold">Amount to Transfer</label>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            R{amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <p className="font-semibold mb-1">Important</p>
          <p>
            Please transfer the exact amount shown above. The payment reference helps us match your payment to your booking automatically. Keep your transaction reference for your records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstantEFTPayment;