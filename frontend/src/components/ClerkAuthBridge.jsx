import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { getAuthToken, clearStoredAuth } from "../lib/auth";

// Keeps localStorage "token"/"user" in step with Clerk for the components that still
// read them. Clerk is the only source now, so signing out clears both.
const REFRESH_MS = 10 * 60 * 1000;

const ClerkAuthBridge = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      clearStoredAuth();
      return;
    }

    let cancelled = false;

    const sync = async ({ force, withProfile }) => {
      const token = await getAuthToken({ force });
      if (!token || cancelled) return;

      if (withProfile) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (err) {
    console.error("Failed to sync user profile:", err);
  }

  // Attach a pending referral code (captured from ?ref=) to this account
  const pendingCode = localStorage.getItem("referralCode");
  if (pendingCode) {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/attach-referral`,
        { referralCode: pendingCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The server gave a definitive answer (attached or not eligible), so clear it
      localStorage.removeItem("referralCode");
    } catch (err) {
      // Network or server error: keep the code and retry on the next login
      console.error("Failed to attach referral:", err);
    }
  }
}
      window.dispatchEvent(new Event("storage"));
    };

    // force on first run so a previous user's token is never reused
    sync({ force: true, withProfile: true });

    const interval = setInterval(() => sync({ force: false, withProfile: false }), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") sync({ force: false, withProfile: false });
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isLoaded, isSignedIn, userId]);

  return null;
};

export default ClerkAuthBridge;