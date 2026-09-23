import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { ToastProvider, useToast } from "./components/Toast";
import { formatErrorMessage } from "./utils/errorFormatter";
import ClerkAuthBridge from "./components/ClerkAuthBridge";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ApplyAsWorker from "./pages/ApplyAsWorker";
import CheckStatus from "./pages/CheckStatus";
import MyBookings from "./components/dashboard/MyBookings";
import BookingPage from "./pages/BookingPage";
import HireHousekeeper from "./pages/HireHousekeeper";
import HireNanny from "./pages/HireNanny";
import HireCarer from "./pages/HireCarer";
import ServicesPage from "./pages/ServicesPage";
import FullTimeHelpPage from "./pages/FullTimeHelpPage";
import AboutUsPage from "./components/AboutUsPage";
import TermsPages from "./pages/TermsPages";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import HousekeeperApplyForm from "./components/forms/HousekeeperApplyForm";
import CarerApplyForm from "./components/forms/CareApplyForm";
import NannyApplyForm from "./components/forms/NannyApplyForm";
import PaymentCallback from "./pages/PaymentCallback";
import GAPageView from "./gaPageView";
import PaymentCancelPage from "./components/PaymentCancelPage";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import AffordableCleanersJohannesburg from "./pages/AffordableCleanersJohannesburg";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";
import ElderCareSouthAfrica from "./pages/ElderCareSouthAfrica";
import ResetPassword from "./pages/ResetPassword";
import BusinessServices from "./pages/BusinessServices";
import ReferEarnPage from "./pages/ReferEarnPage";
import PropertyManagerDashboard from "./pages/PropertyManagerDashboard";
import useReferralCapture from "./hooks/useReferralCapture";

const AppContent = () => {
  const toast = useToast();
  useReferralCapture(); 

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });

    // Set up axios interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const errorMessage = error.response?.data?.message || "";
          
          // Check if it's a token expiration error
          if (errorMessage.includes("expired") || errorMessage.includes("Token expired")) {
            // Save the current path so the user returns here after login
            const currentPath = window.location.pathname + window.location.search;
            if (currentPath && currentPath !== "/login" && currentPath !== "/sign-up") {
              localStorage.setItem("redirectAfterLogin", currentPath);
            }

            // Clear authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Dispatch custom event for Navbar to react
            window.dispatchEvent(new CustomEvent("userLoggedOut"));
            
            // Also trigger storage event for cross-tab sync
            window.dispatchEvent(new Event("storage"));
            
            // Show user-friendly notification
            toast.error("Your session has expired. Please log in again.", 4000);
            
            // Redirect to login page after a short delay
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          } else {
            // Show other 401 errors
            toast.error(formatErrorMessage(error));
          }
        } else if (error.response?.status >= 500) {
          // Show server errors
          toast.error(formatErrorMessage(error));
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [toast]);

  return (
    <>
      <ClerkAuthBridge />
      <GAPageView />
      <Navbar />

      {/* Main routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up/*" element={<SignUp />} /> 
        <Route path="/login/*" element={<Login />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-as-worker" element={<ApplyAsWorker />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/services/booking" element={<BookingPage />} />
        <Route path="/fulltime-help/hire-housekeeper" element={<HireHousekeeper />} />
        <Route path="/fulltime-help/hire-nanny" element={<HireNanny />} />
        <Route path="/fulltime-help/hire-carer" element={<HireCarer />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/fulltime-help" element={<FullTimeHelpPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/terms" element={<TermsPages />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/services/housekeeper/apply" element={<HousekeeperApplyForm />} />
        <Route path="/services/carer/apply" element={<CarerApplyForm />} />
        <Route path="/services/nanny/apply" element={<NannyApplyForm />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/affordable-cleaners-johannesburg" element={<AffordableCleanersJohannesburg />} />
        <Route path="/elder-care-south-africa" element={<ElderCareSouthAfrica />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/business-services" element={<BusinessServices />} />
        <Route path="/business-services/refer-earn" element={<ReferEarnPage />} />
        <Route path="/property-manager" element={<PropertyManagerDashboard />} />
      </Routes>

      {/* Chatbot - Always visible */}
      <Chatbot />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
};

export default App;
