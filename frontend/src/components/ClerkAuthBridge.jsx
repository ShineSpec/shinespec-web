import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const ClerkAuthBridge = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const intervalRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const syncToken = async () => {
      if (!isSignedIn) {
  if (localStorage.getItem("authProvider") === "clerk") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authProvider");
    window.dispatchEvent(new Event("storage"));
  }
  return;
}

const token = await getToken();
if (!token) return;
localStorage.setItem("token", token);
localStorage.setItem("authProvider", "clerk");

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to sync user profile:", err);
      }

      window.dispatchEvent(new Event("storage"));
    };

    if (isLoaded) {
      syncToken();
      // Clerk session tokens are short-lived — refresh before they expire
      intervalRef.current = setInterval(syncToken, 50000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isLoaded, isSignedIn]);

  return null;
};

export default ClerkAuthBridge;