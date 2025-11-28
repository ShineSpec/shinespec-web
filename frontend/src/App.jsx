import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
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

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <Navbar />

      {/* Main routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-as-worker" element={<ApplyAsWorker />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/services/booking" element={<BookingPage />} />
        <Route path="/hire-housekeeper" element={<HireHousekeeper />} />
        <Route path="/hire-nanny" element={<HireNanny />} />
        <Route path="/hire-carer" element={<HireCarer />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/fulltime-help" element={<FullTimeHelpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
