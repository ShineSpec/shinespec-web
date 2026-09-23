import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gift, Clock, Wallet, CheckCircle, AlertCircle, ArrowLeft, Loader2, Lock, User, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: "Join in under two minutes",
    description: "Fill in your details below. No contracts, no waiting period.",
  },
  {
    icon: <Gift className="w-6 h-6 text-pink-600" />,
    title: "Send us your clients",
    description: "Every time a client you refer completes a ShineSpec booking, it's tracked to you.",
  },
  {
    icon: <Wallet className="w-6 h-6 text-green-600" />,
    title: "Get paid",
    description: "Choose R150 Quick Cash once, or 10% on your referred client's first 5 bookings.",
  },
];

const ReferEarnPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ── Auth state ──────────────────────────────────────────────
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  // ── Page state ──────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [existingReferral, setExistingReferral] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Pre-fill from the logged-in user's profile
  const [form, setForm] = useState({
    fullName: loggedInUser ? `${loggedInUser.name} ${loggedInUser.lastname}` : "",
    email: loggedInUser?.email || "",
    phone: loggedInUser?.phone || "",
    agencyName: "",
    payoutPreference: "quick-cash",
    message: "",
  });

  // ── On mount: check if this user already has a referral ────
  useEffect(() => {
    if (!token) { setCheckingExisting(false); return; }

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/my-referral`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.referral) setExistingReferral(data.referral);
        }
      } catch (e) {
        // silently ignore — not critical
      } finally {
        setCheckingExisting(false);
      }
    };
    check();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.agencyName) {
      setError("Please fill in your name, email, phone, and agency/company name");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/referral-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      const data = await res.json();
      setExistingReferral({ referralCode: data.referralCode, payoutPreference: form.payoutPreference, status: "pending" });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── NOT LOGGED IN ───────────────────────────────────────────
  if (!token || !loggedInUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-6 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to join</h2>
          <p className="text-gray-600 text-sm mb-8">
            The Refer & Earn program is linked to your ShineSpec account so we can track your referrals and pay you accurately.
          </p>
          <button
            onClick={() => navigate("/login", { state: { returnTo: "/business-services/refer-earn" } })}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all mb-3"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup", { state: { returnTo: "/business-services/refer-earn" } })}
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

  // ── LOADING CHECK ────────────────────────────────────────────
  if (checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  // ── ALREADY REGISTERED ───────────────────────────────────────
  if (existingReferral && !submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto">
          <Link to="/business-services" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Business Services
          </Link>

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're already a partner</h2>
            <p className="text-gray-600 text-sm mb-8">
              Hi {loggedInUser.name}, your referral account is active. Share your code with clients to start earning.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Referral Code</p>
              <p className="text-4xl font-bold text-gray-900 tracking-wider">{existingReferral.referralCode}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(existingReferral.referralCode);
                }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Copy to clipboard
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
              <span>Payout plan:</span>
              <span className="font-semibold text-gray-900">
                {existingReferral.payoutPreference === "quick-cash" ? "💵 Quick Cash — R150" : "📈 10% for 5 Bookings"}
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN FORM ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 pb-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <Link to="/business-services" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Business Services
        </Link>

        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl sm:text-5xl text-gray-900">
            Refer & <span className="font-bold text-black">Earn<span className="text-blue-500">.</span></span>
          </h1>
          <p className="text-gray-700 mt-4 max-w-xl mx-auto">
            Built for estate agents and property professionals who already recommend trusted services — now get paid for it.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <div key={step.title} data-aos="fade-up" data-aos-delay={index * 100} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto" data-aos="fade-up">
          {/* Logged-in user badge */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{loggedInUser.name} {loggedInUser.lastname}</p>
              <p className="text-xs text-gray-500">{loggedInUser.email} · Signing up with your ShineSpec account</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">You're in</h2>
              <p className="text-gray-600 max-w-sm mx-auto mb-6">
                Your referral account is now linked to your ShineSpec profile. Your unique code will arrive by email within one business day.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Join the program</h2>
              <p className="text-gray-600 text-sm mb-6">Takes about two minutes.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      placeholder="Jane Mokoena"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agency / Company Name</label>
                    <input
                      type="text"
                      name="agencyName"
                      value={form.agencyName}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      placeholder="Mokoena Properties"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-gray-50"
                      placeholder="jane@agency.co.za"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-gray-50"
                      placeholder="082 123 4567"
                    />
                  </div>
                </div>

                {/* Payout preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How would you like to be paid?</label>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, payoutPreference: "quick-cash" }))}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        form.payoutPreference === "quick-cash" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-gray-900 text-sm">💵 Quick Cash — R150 once</p>
                      <p className="text-xs text-gray-500 mt-1">A single R150 cash payment after your first successful referral completes their booking.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, payoutPreference: "commission" }))}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        form.payoutPreference === "commission" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-gray-900 text-sm">📈 10% for 5 Bookings</p>
                      <p className="text-xs text-gray-500 mt-1">Earn 10% of the booking value on each of your referred client's first 5 completed bookings.</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anything else we should know? (optional)</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
                    placeholder="e.g., I refer about 5–10 clients a month across Sandton"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting...</span></>
                  ) : (
                    <span>Join the Referral Program</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferEarnPage;