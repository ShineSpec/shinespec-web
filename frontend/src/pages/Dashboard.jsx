import React, { useState } from "react";
import { 
  Home, User, Calendar, Award, MapPin, CreditCard, Wallet, 
  Ticket, Share2, LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileContent from "../components/dashboard/ProfileContent";
import MyBookings from "../components/dashboard/MyBookings";
import SpecStarsContent from "../components/dashboard/SpecStarsContent";
import LocationsContent from "../components/dashboard/LocationsContent";
import PaymentsContent from "../components/dashboard/PaymentsContent";
import CreditContent from "../components/dashboard/CreditContent";
import VouchersContent from "../components/dashboard/VouchersContent";
import ReferEarnContent from "../components/dashboard/ReferEarnContent";
import ServicesSidebar from "../components/dashboard/ServicesSidebar";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Profile");
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Profile" },
    { icon: Calendar, label: "Bookings" },
    { icon: MapPin, label: "Locations" },
    { icon: Award, label: "SpecStars" },
    { icon: CreditCard, label: "Payments" },
    { icon: Wallet, label: "Credit" },
    { icon: Ticket, label: "Vouchers" },
    { icon: Share2, label: "Refer & Earn" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Profile": return <ProfileContent />;
      case "Bookings": return <MyBookings />;
      case "SpecStars": return <SpecStarsContent />;
      case "Locations": return <LocationsContent />;
      case "Payments": return <PaymentsContent />;
      case "Credit": return <CreditContent />;
      case "Vouchers": return <VouchersContent />;
      case "Refer & Earn": return <ReferEarnContent />;
      default: return <ProfileContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col mt-28">
        <nav className="flex-1 px-4">
          {menuItems.map(({ icon: Icon, label }) => (
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-8 mt-20">{renderContent()}</div>

        {/* Services Sidebar */}
        <ServicesSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
