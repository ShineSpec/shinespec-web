import React, { useState, useEffect } from "react";
import { 
  Home, User, Calendar, Award, MapPin, CreditCard, Wallet, 
  Ticket, Share2, LogOut, Menu, X, Building2, ArrowRight, Gift, LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import MyBookings from "./MyBookings";
import ServiceProvidersContent from "./ServiceProvidersContent";
import LocationsContent from "./LocationsContent";
import PaymentsContent from "./PaymentsContent";
import CreditContent from "./CreditContent";
import VouchersContent from "./VouchersContent";
import ReferEarnContent from "./ReferEarnContent";
import ServicesSidebar from "./ServicesSidebar";
import { useClerk } from "@clerk/clerk-react";

const CustomerDashboard = () => {
  const { signOut } = useClerk();
  const [activeMenu, setActiveMenu] = useState("Profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Main navigation items (shown in bottom nav on mobile)
  const mainMenuItems = [
  { icon: User, label: "Profile" },
  { icon: Calendar, label: "Bookings" },
  { icon: MapPin, label: "Locations" },
  { icon: Award, label: "Service providers" },
  { icon: Building2, label: "Business & Partners" },  // ← correct icon
];

  // Secondary menu items (shown in mobile drawer)
  const secondaryMenuItems = [
    { icon: CreditCard, label: "Payments" },
    //{ icon: Wallet, label: "Credit" },
    //{ icon: Ticket, label: "Vouchers" },
    //{ icon: Share2, label: "Refer & Earn" },
  ];

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleMenuClick = (label) => {
    setActiveMenu(label);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
  switch (activeMenu) {
    case "Profile": return <ProfileContent />;
    case "Bookings": return <MyBookings />;
    case "Service providers": return <ServiceProvidersContent />;
    case "Locations": return <LocationsContent />;
    case "Payments": return <PaymentsContent />;
    case "Credit": return <CreditContent />;
    case "Vouchers": return <VouchersContent />;
    case "Refer & Earn": return <ReferEarnContent />;
    case "Business & Partners": return <PartnersContent />;
    default: return <ProfileContent />;
  }
};

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col mt-20">
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {[...mainMenuItems, ...secondaryMenuItems].map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveMenu(label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeMenu === label
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-50 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {[...mainMenuItems, ...secondaryMenuItems].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => handleMenuClick(label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === label
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-50 rounded-lg transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">SIGN OUT</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{activeMenu}</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 mt-20">
          {renderContent()}
        </div>

        {/* Services Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <ServicesSidebar />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center h-16">
          {mainMenuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveMenu(label)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                activeMenu === label
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <Icon className={`h-5 w-5 ${activeMenu === label ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


const PartnersContent = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const [referral, setReferral] = useState(null);
  const [loadingReferral, setLoadingReferral] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState("overview"); // "overview" | "commissions"

  useEffect(() => {
    if (!token) { setLoadingReferral(false); return; }
    fetch(`${API_BASE_URL}/api/auth/my-referral`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setReferral(data.referral || null))
      .catch(() => {})
      .finally(() => setLoadingReferral(false));
  }, [token]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalUnpaid = referral?.commissions
    ?.filter((c) => !c.paid)
    .reduce((s, c) => s + c.commissionAmount, 0) || 0;

  const totalPaid = referral?.commissions
    ?.filter((c) => c.paid)
    .reduce((s, c) => s + c.commissionAmount, 0) || 0;

  const bookingsRemaining =
    referral?.payoutPreference === "commission"
      ? Math.max(0, 5 - (referral?.commissions?.length || 0))
      : null;

  if (loadingReferral) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-2">

      {/* ── Page header ───────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business & Partner Tools</h2>
        <p className="text-gray-500 text-sm mt-1">
          Referral tracking, property management, and commercial services.
        </p>
      </div>

      {/* ── REFERRAL SECTION ──────────────────────────────────── */}
      {referral ? (
        <>
          {/* Sub-nav */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {["overview", "commissions"].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeView === view
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* ── Overview ── */}
          {activeView === "overview" && (
            <div className="space-y-4">

              {/* Referral code card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-400 text-xs uppercase tracking-widest">Your Referral Code</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    referral.status === "active"
                      ? "bg-green-900 text-green-300 border border-green-700"
                      : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                  }`}>
                    {referral.status}
                  </span>
                </div>

                <p className="text-4xl font-bold tracking-widest mt-2 mb-4">
                  {referral.referralCode}
                </p>

                <p className="text-gray-400 text-xs mb-4">
                  {referral.payoutPreference === "quick-cash"
                    ? "💵 Quick Cash plan — R150 on your referred client's first booking"
                    : "📈 Commission plan — 10% on your referred client's first 5 bookings"}
                </p>

                {/* Copy buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleCopy(referral.referralCode)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    {copied ? "✓ Copied!" : "Copy code"}
                  </button>
                  <button
                    onClick={() =>
                      handleCopy(`https://shinespec.com/?ref=${referral.referralCode}`)
                    }
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    Copy referral link
                  </button>
                </div>

                <p className="text-gray-500 text-xs mt-3 truncate">
                  shinespec.com/?ref={referral.referralCode}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Clients Referred",
                    value: referral.totalReferrals || 0,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Total Earned",
                    value: `R${(referral.totalEarned || 0).toFixed(2)}`,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    label: "Awaiting Payout",
                    value: `R${totalUnpaid.toFixed(2)}`,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                  },
                  {
                    label: "Paid Out",
                    value: `R${totalPaid.toFixed(2)}`,
                    color: "text-gray-700",
                    bg: "bg-gray-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.bg} rounded-2xl p-4 border border-gray-100`}
                  >
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Commission plan progress — only for commission plan */}
              {referral.payoutPreference === "commission" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">Commission Progress</p>
                    <p className="text-xs text-gray-500">
                      {referral.commissions?.length || 0} / 5 bookings earned
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(((referral.commissions?.length || 0) / 5) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {bookingsRemaining > 0
                        ? `${bookingsRemaining} booking${bookingsRemaining !== 1 ? "s" : ""} remaining`
                        : "All 5 commission bookings complete"}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      10% per booking
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Cash status — only for quick-cash plan */}
              {referral.payoutPreference === "quick-cash" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Quick Cash Status</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      (referral.commissions?.length || 0) > 0
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}>
                      {(referral.commissions?.length || 0) > 0 ? "✓" : "⏳"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {(referral.commissions?.length || 0) > 0
                          ? "R150 commission earned"
                          : "Waiting for first referred booking"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(referral.commissions?.length || 0) > 0
                          ? referral.commissions[0].paid
                            ? "Paid out ✓"
                            : "Awaiting payout from ShineSpec"
                          : "Your R150 triggers when your referred client completes their first booking"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Agency info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Your Partner Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-900 font-medium">{referral.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Agency</span>
                    <span className="text-gray-900 font-medium">{referral.agencyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900 font-medium">{referral.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900 font-medium">{referral.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payout Plan</span>
                    <span className="text-gray-900 font-medium">
                      {referral.payoutPreference === "quick-cash"
                        ? "💵 Quick Cash"
                        : "📈 10% Commission"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(referral.createdAt).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Commissions history ── */}
          {activeView === "commissions" && (
            <div className="space-y-4">
              {(!referral.commissions || referral.commissions.length === 0) ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                  <p className="text-3xl mb-3">💸</p>
                  <p className="text-gray-900 font-semibold">No commissions yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Share your referral link and start earning when referred clients book.
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(`https://shinespec.com/?ref=${referral.referralCode}`)
                    }
                    className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all"
                  >
                    {copied ? "Copied!" : "Copy referral link"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Commission History</p>
                      <p className="text-xs text-gray-500">
                        {referral.commissions.length} transaction{referral.commissions.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {[...referral.commissions].reverse().map((c, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                              c.type === "quick-cash"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                            }`}>
                              {c.type === "quick-cash" ? "💵" : "📈"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {c.type === "quick-cash"
                                  ? "Quick Cash Reward"
                                  : `10% Commission`}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(c.date).toLocaleDateString("en-ZA", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                {" · "}Booking value: R{(c.bookingCost || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              +R{(c.commissionAmount || 0).toFixed(2)}
                            </p>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              c.paid
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {c.paid ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Totals footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between text-sm">
                      <span className="text-gray-500">Total earned</span>
                      <span className="font-bold text-gray-900">
                        R{(referral.totalEarned || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {totalUnpaid > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">⏳</span>
                      <div>
                        <p className="text-sm font-semibold text-yellow-900">
                          R{totalUnpaid.toFixed(2)} awaiting payout
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          ShineSpec processes payouts manually. Contact{" "}
                          <a href="mailto:support@shinespec.com" className="underline">
                            support@shinespec.com
                          </a>{" "}
                          if you have questions about your pending balance.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        /* ── Not yet a partner ── */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-4xl mb-3">🤝</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Not a referral partner yet
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Join the Refer & Earn program and earn R150 cash or 10% on your
            referred client's first 5 bookings. Takes under two minutes to sign up.
          </p>
          <button
            onClick={() => navigate("/business-services/refer-earn")}
            className="px-7 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all text-sm"
          >
            Join the Program
          </button>
        </div>
      )}

      {/* ── Quick links to other tools ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <button
          onClick={() => navigate("/business-services")}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md transition-all group"
        >
          <span className="text-2xl block mb-2">🏢</span>
          <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
            Business Services
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Office, retail, events & Airbnb cleaning
          </p>
        </button>
        <button
          onClick={() => navigate("/property-manager")}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md transition-all group"
        >
          <span className="text-2xl block mb-2">🏠</span>
          <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
            Property Dashboard
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Bookings grouped by property address
          </p>
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
