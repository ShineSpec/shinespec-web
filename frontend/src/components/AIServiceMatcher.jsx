import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, Info } from 'lucide-react';
import {
  matchService,
  applyMatchToDetails,
  summarizeDetails,
  missingFields,
  normalizeHours,
  localToday,
  SERVICE_TYPES,
} from '../lib/serviceMatcher';

// How it works
// 1. The words are understood on the customer's own device by lib/serviceMatcher.js.
//    That is instant and needs no internet, no API key and no tokens.
// 2. Only when that cannot tell which service is meant do we ask the server's AI.
//    If the AI is unavailable (no tokens, offline, slow) nothing breaks: the customer
//    just keeps the service they already had open.

const EXAMPLES = [
  'Deep clean my 3 bedroom house tomorrow morning',
  'Party cleanup after 80 guests on Saturday',
  'Garden and pool service Friday at 8am',
];

const HOURLY = (service) => service !== 'Laundry & Ironing' && service !== 'Event Cleaning';

const AIServiceMatcher = ({ onMatch, bookingDetails, setBookingDetails }) => {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { details, notes, found, canUndo }
  const [refining, setRefining] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // always read the latest booking details without re-creating handlers
  const detailsRef = useRef(bookingDetails);
  detailsRef.current = bookingDetails;
  const undoRef = useRef(null);
  const requestId = useRef(0);
  const abortRef = useRef(null);

  useEffect(
    () => () => {
      requestId.current += 1;
      abortRef.current?.abort();
    },
    []
  );

  const show = (details, local, extra = {}) => {
    const found =
      !!local.serviceType ||
      local.hoursNeeded != null ||
      !!local.scheduledDate ||
      !!local.scheduledTime ||
      local.extraTasks.length > 0 ||
      !!local.homeSize ||
      !!local.eventSize ||
      !!local.eventCleaningScope ||
      !!local.laundryBundle ||
      !!local.officeSpecialRequests;
    setResult({ details, notes: local.notes || [], found, ...extra });
  };

  // Ask the server's AI, but only to fill the one gap the offline matcher has: the service.
  const askAI = async (text, local, clock, before) => {
    if (!API_BASE_URL) return;
    const id = ++requestId.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), 6000);
    setRefining(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/ai-service-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text, currentService: before.serviceType }),
        signal: controller.signal,
      });
      if (!res.ok || id !== requestId.current) return;
      const data = await res.json();
      if (id !== requestId.current || data?.source !== 'ai') return;
      if (!SERVICE_TYPES.includes(data.serviceType)) return;

      // re-read the text for the service the AI chose, so extras and options fit it
      const redo = matchService(text, { ...clock, currentService: data.serviceType });
      redo.serviceType = data.serviceType;
      if (redo.hoursNeeded == null && data.hoursNeeded != null && HOURLY(data.serviceType)) {
        redo.hoursNeeded = normalizeHours(data.serviceType, data.hoursNeeded);
      }
      const applied = applyMatchToDetails(before, redo);
      setBookingDetails((prev) => applyMatchToDetails(prev, redo));
      show(applied, redo, { canUndo: true });
      onMatch?.({
        serviceType: applied.serviceType,
        hoursNeeded: applied.hoursNeeded,
        urgency: redo.urgency,
        location: redo.location,
      });
    } catch {
      // out of tokens, offline or too slow: keep what we already have
    } finally {
      clearTimeout(timer);
      if (id === requestId.current) setRefining(false);
    }
  };

  const handleMatch = () => {
    const text = userInput.trim();
    if (!text) {
      setError('Please describe what you need help with');
      return;
    }
    setError('');
    setRefining(false);
    abortRef.current?.abort();
    requestId.current += 1;

    const before = detailsRef.current;
    const clock = localToday();
    const local = matchService(text, { ...clock, currentService: before.serviceType });
    const applied = applyMatchToDetails(before, local);

    undoRef.current = before;
    setBookingDetails((prev) => applyMatchToDetails(prev, local));
    show(applied, local, { canUndo: true });
    onMatch?.({
      serviceType: applied.serviceType,
      hoursNeeded: applied.hoursNeeded,
      urgency: local.urgency,
      location: local.location,
    });

    if (!local.serviceType && text.split(/\s+/).length >= 3) {
      askAI(text, local, clock, before);
    }
  };

  const handleUndo = () => {
    if (!undoRef.current) return;
    const previous = undoRef.current;
    undoRef.current = null;
    requestId.current += 1;
    abortRef.current?.abort();
    setRefining(false);
    setBookingDetails(previous);
    setResult(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent?.isComposing) {
      e.preventDefault();
      handleMatch();
    }
  };

  const chips = result?.found ? summarizeDetails(result.details) : [];
  const missing = result?.found ? missingFields(result.details) : [];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 xl:p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <img src="/ai.png" alt="" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base xl:text-lg leading-tight">AI Service Matcher</h3>
          <p className="text-xs xl:text-sm text-gray-600 mt-0.5">
            Describe what you need in your own words and we'll fill in the booking for you
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="e.g., My house is messy after a party and I need help urgently"
          aria-label="Describe the service you need"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-sm bg-white"
          rows={3}
          maxLength={600}
        />

        {!result && !userInput && (
          <div className="hidden xl:flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setUserInput(ex)}
                className="text-xs text-left px-2.5 py-1.5 rounded-full bg-white/80 border border-purple-200 text-purple-800 hover:bg-white hover:border-purple-400 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div aria-live="polite">
          {result?.found && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 font-medium flex-1">Done. Your booking details are updated.</p>
                {result.canUndo && (
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1 text-xs text-green-800 hover:text-green-950 underline underline-offset-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Undo
                  </button>
                )}
              </div>

              <ul className="flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <li
                    key={c.key}
                    className="text-xs bg-white border border-green-200 text-gray-800 rounded-full px-2.5 py-1 max-w-full"
                  >
                    <span className="text-gray-500">{c.label}:</span> <span className="font-medium">{c.value}</span>
                  </li>
                ))}
              </ul>

              {result.notes.map((n) => (
                <p key={n} className="flex items-start gap-1.5 text-xs text-amber-800">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {n}
                </p>
              ))}

              {missing.length > 0 && (
                <p className="text-xs sm:text-sm text-blue-700 font-medium">Please still choose {missing.join(', ')}.</p>
              )}
            </div>
          )}

          {result && !result.found && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                We couldn't pick out any booking details, so nothing was changed. Try mentioning the job, when, and for how
                long, like "clean my 2 bedroom flat on Saturday morning".
              </p>
            </div>
          )}

          {refining && (
            <p className="flex items-center gap-2 text-xs text-gray-600 mt-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Taking a closer look...
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleMatch}
          disabled={!userInput.trim()}
          className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <img src="/ai.png" alt="" className="w-4 h-4 object-contain" />
          <span>Match Service</span>
        </button>

        <p className="text-xs text-gray-500 text-center">Press Enter to match, or click the button above</p>
      </div>
    </div>
  );
};

export default AIServiceMatcher;