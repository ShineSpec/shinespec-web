import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
 
const readProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};
 
export default function useAppUser() {
  const { isLoaded, isSignedIn } = useAuth();
  const [profile, setProfile] = useState(readProfile);
 
  useEffect(() => {
    const refresh = () => setProfile(readProfile());
    window.addEventListener("storage", refresh); // fired by ClerkAuthBridge after /me
    window.addEventListener("userLoggedOut", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("userLoggedOut", refresh);
    };
  }, []);
 
  return {
    isLoaded,                              // false until Clerk has finished loading
    isSignedIn: Boolean(isSignedIn),
    profile: isSignedIn ? profile : null,  // may be null for a moment after sign-in
  };
}
 
