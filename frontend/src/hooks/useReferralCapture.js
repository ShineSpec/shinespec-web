import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Call this once in App.jsx — it runs silently on every page load
const useReferralCapture = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (ref && ref.startsWith("AGT-")) {
      // Only store if not already referred (first-touch attribution)
      if (!localStorage.getItem("referralCode")) {
        localStorage.setItem("referralCode", ref);
        console.log("Referral captured:", ref);
      }
    }
  }, [location.search]);
};

export default useReferralCapture;