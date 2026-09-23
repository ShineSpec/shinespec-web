import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const AIServiceMatcher = ({ onMatch, bookingDetails, setBookingDetails }) => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matched, setMatched] = useState(false);
  const [matchedDetails, setMatchedDetails] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token');

  const handleMatch = async () => {
    if (!userInput.trim()) {
      setError('Please describe what you need help with');
      return;
    }

    setLoading(true);
    setError('');
    setMatched(false);

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/ai-service-match`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ description: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to match service');
      }

      const data = await response.json();
      const { serviceType, hoursNeeded, urgency, location, scheduledDate, scheduledTime, extraTasks } = data;

      // Update booking details - auto-fill everything that was detected
      // Date and time only set if mentioned in description, otherwise user must select
      const updatedDetails = {
        ...bookingDetails,
        serviceType: serviceType || bookingDetails.serviceType,
        hoursNeeded: hoursNeeded || bookingDetails.hoursNeeded,
        urgency: urgency || 'normal',
        // Use extracted extra tasks if provided, otherwise keep existing or empty array
        extraTasks: (extraTasks && extraTasks.length > 0) ? extraTasks : (bookingDetails.extraTasks || []),
        // Set date/time if extracted, otherwise clear them so user must select
        scheduledDate: scheduledDate || '',
        scheduledTime: scheduledTime || '',
      };

      setBookingDetails(updatedDetails);
      setMatchedDetails(updatedDetails); // Store matched details to check in UI
      setMatched(true);

      // Call the callback if provided
      if (onMatch) {
        onMatch({
          serviceType,
          hoursNeeded,
          urgency,
          location,
        });
      }

      // Clear input after successful match (but keep the success message visible)
      setTimeout(() => {
        setUserInput('');
        // Keep matched state and matchedDetails - don't clear them so message stays visible
      }, 1000); // Clear input after 1 second, but keep success message
    } catch (err) {
      console.error('AI Service Match error:', err);
      setError(err.message || 'Failed to analyze your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMatch();
    }
  };

  return (
    <div className="mb-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <img src="/ai.png" alt="AI" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1">AI Service Matcher</h3>
          <p className="text-sm text-gray-600">
            Describe your problem in plain language and we'll find the perfect service for you
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              setError('');
              // Don't clear matched state when typing - let it persist
            }}
            onKeyPress={handleKeyPress}
            placeholder="e.g., My house is messy after a party and I need help urgently"
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-sm"
            rows="3"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {matched && (
          <div className="flex flex-col gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                Service matched! Your booking details have been updated.
              </p>
            </div>
            {matchedDetails && (!matchedDetails.scheduledDate || !matchedDetails.scheduledTime) && (
              <p className="text-sm text-blue-700 ml-6 font-medium">
                Please select a date and time for your service booking.
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleMatch}
          disabled={loading || !userInput.trim()}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <img src="/ai.png" alt="AI" className="w-4 h-4 object-contain" />
              <span>Match Service</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Press Enter to match, or click the button above
        </p>
      </div>
    </div>
  );
};

export default AIServiceMatcher;

