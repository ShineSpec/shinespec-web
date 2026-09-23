import React, { useState, useEffect } from "react";
import {
  Home, User, Calendar, Award, MapPin, LogOut, Menu, X,
  CheckCircle, Clock, AlertCircle, Briefcase, Star, Phone, Mail,
  TrendingUp, DollarSign, Bell, Settings, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast";
import WorkerTasksContent from "./WorkerTasksContent";
import WorkerProfileContent from "./WorkerProfileContent";
import WorkerStatsContent from "./WorkerStatsContent";
import WorkerAvailabilityContent from "./WorkerAvailabilityContent";
import { useClerk } from "@clerk/clerk-react";

const WorkerDashboard = () => {
  const { signOut } = useClerk();
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const mainMenuItems = [
    { icon: Home, label: "Overview", color: "blue" },
    { icon: Briefcase, label: "Tasks", color: "green" },
    { icon: Award, label: "Performance", color: "purple" },
    { icon: Calendar, label: "Availability", color: "orange" },
    { icon: User, label: "Profile", color: "indigo" },
  ];

  useEffect(() => {
    fetchWorkerProfile();
    fetchNotifications();
  }, [token]);

  const fetchWorkerProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workers/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setWorkerData(data);
      } else if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        handleLogout();
      }
    } catch (err) {
      console.error("Fetch worker profile error:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // This would be a new endpoint for notifications
      // For now, we'll use bookings as notifications
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/workers/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const bookings = await res.json();
        // Create notifications from pending bookings
        const pendingBookings = bookings.filter(b => b.status === "pending");
        setNotifications(pendingBookings.map(b => ({
          id: b._id,
          type: "booking",
          message: `New booking request: ${b.serviceType}`,
          date: b.scheduledDate,
          booking: b
        })));
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

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

  const renderOverview = () => {
    if (!workerData) return null;

    const pendingBookings = notifications.length;
    const todayBookings = notifications.filter(n => {
      const today = new Date().toDateString();
      return new Date(n.date).toDateString() === today;
    }).length;

    return (
      <div className="space-y-6 lg:mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {workerData.fullName?.split(' ')[0]}!</h2>
            <p className="text-gray-600 mt-1">Here's what's happening today</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Active Tasks</p>
            <p className="text-3xl font-bold">{pendingBookings}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-green-100 text-sm mb-1">Jobs Completed</p>
            <p className="text-3xl font-bold">{workerData.jobsCompleted || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-yellow-100 text-sm mb-1">Rating</p>
            <p className="text-3xl font-bold">{workerData.rating || 0}%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <Clock className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-purple-100 text-sm mb-1">Today's Bookings</p>
            <p className="text-3xl font-bold">{todayBookings}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActiveMenu("Tasks")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">View All Tasks</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setActiveMenu("Availability")}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Update Availability</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setActiveMenu("Profile")}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Overview":
        return renderOverview();
      case "Tasks":
        return <WorkerTasksContent workerData={workerData} onUpdate={fetchWorkerProfile} />;
      case "Performance":
        return <WorkerStatsContent workerData={workerData} />;
      case "Availability":
        return <WorkerAvailabilityContent workerData={workerData} onUpdate={fetchWorkerProfile} />;
      case "Profile":
        return <WorkerProfileContent workerData={workerData} onProfileUpdate={fetchWorkerProfile} />;
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col shadow-sm mt-20">
        {/* Worker Info Card */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4 mb-4">
            {workerData?.photoDocument ? (
              <img
                src={workerData.photoDocument}
                alt={workerData.fullName}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-gray-900 truncate">{workerData?.fullName}</p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-medium">{workerData?.rating || 0}%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <p className="font-bold text-gray-900">{workerData?.jobsCompleted || 0}</p>
              <p className="text-xs text-gray-600">Jobs</p>
            </div>
            <div className={`bg-white/60 rounded-lg p-2 text-center ${
              workerData?.status === 'approved' ? 'text-green-700' : 'text-yellow-700'
            }`}>
              <p className="font-bold capitalize">{workerData?.status || 'pending'}</p>
              <p className="text-xs">Status</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {mainMenuItems.map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={() => setActiveMenu(label)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                activeMenu === label
                  ? `bg-${color}-50 text-${color}-700 border-2 border-${color}-200 shadow-sm`
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className={`h-5 w-5 ${activeMenu === label ? `text-${color}-600` : ''}`} />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition font-semibold"
          >
            <LogOut className="h-5 w-5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/50 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {workerData && (
                <div className="flex items-center gap-3">
                  {workerData.photoDocument && (
                    <img
                      src={workerData.photoDocument}
                      alt={workerData.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{workerData.fullName}</p>
                    <p className="text-xs text-gray-600">Rating: {workerData.rating || 0}%</p>
                  </div>
                </div>
              )}
            </div>
            <nav className="p-4 space-y-1">
              {mainMenuItems.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={() => handleMenuClick(label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeMenu === label ? `bg-${color}-50 text-${color}-700` : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition font-semibold"
                >
                  <LogOut className="h-5 w-5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{activeMenu}</h1>
          <div className="w-10" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center h-16">
          {mainMenuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveMenu(label)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                activeMenu === label ? "text-blue-600" : "text-gray-500"
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

export default WorkerDashboard;
