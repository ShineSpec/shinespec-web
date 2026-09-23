import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

const navItems = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Company", href: "#company" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    let isMounted = true;
    let isChecking = false; // Prevent concurrent API calls

    const checkAuth = async (skipApiCheck = false) => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      // If no token, clear user state immediately (no API call needed)
      if (!token) {
        if (isMounted) {
          setUser(null);
          if (storedUser) {
            localStorage.removeItem("user");
          }
        }
        return;
      }

      // If we're skipping API check (e.g., from storage event), just use stored data
      if (skipApiCheck && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (isMounted) {
            setUser(userData);
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
          if (isMounted) {
            setUser(null);
          }
        }
        return;
      }

      // Prevent concurrent API calls
      if (isChecking) return;
      isChecking = true;

      // Verify token is still valid by calling the API
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          // Token is valid, set user from stored data
          if (storedUser && isMounted) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (e) {
              console.error("Error parsing user data:", e);
              // If parsing fails, get user from API response
              const userData = await res.json();
              if (isMounted) {
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
              }
            }
          }
        } else if (res.status === 401) {
          // Token is invalid or expired — only clear on explicit 401
          if (isMounted) {
            // Save current path so user returns here after re-login
            const currentPath = window.location.pathname + window.location.search;
            if (currentPath && currentPath !== "/login" && currentPath !== "/sign-up") {
              localStorage.setItem("redirectAfterLogin", currentPath);
            }
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } else {
          // Other server errors (500, 503, etc.) — keep user logged in with stored data
          if (storedUser && isMounted) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              // ignore parse error
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Network error (server down, no internet, etc.) — DON'T log the user out
        // Just use stored data so the session persists
        if (storedUser && isMounted) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            // ignore parse error
          }
        }
      } finally {
        isChecking = false;
      }
    };

    // Check on mount with API verification
    checkAuth(false);

    // Listen for custom logout event (from axios interceptor)
    const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
    

    // Listen for storage changes (cross-tab) - skip API check for performance
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth(true); // Skip API check on storage change
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedOut", handleLogout);

    // Check periodically (less frequently to avoid too many API calls)
    const interval = setInterval(() => {
      // Only verify token if we think we're logged in
      if (localStorage.getItem("token")) {
        checkAuth(false);
      }
    }, 60000); // Check every 60 seconds

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedOut", handleLogout);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    window.location.reload(); // 🔁 Force page reload to reset navbar state
  };

  // ✅ Improved initials function to use both name & lastname
  const getInitials = (user) => {
    if (!user) return "";
    const first = user.name ? user.name.trim().charAt(0).toUpperCase() : "";
    const last = user.lastname ? user.lastname.trim().charAt(0).toUpperCase() : "";
    return `${first}${last}`;
  };

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-20 py-4 flex items-center justify-between">
        {/* Logo */}
<div className="flex items-center font-bold text-gray-900">
  <Link to="/">
    <div className="flex items-center justify-center text-gray-900 space-x-1">
      <img
        src="/logo-ShineSpec.webp"
        alt="ShineSpec Logo"
        className="h-9 w-auto sm:h-10 md:h-12 transition-all"
      />

      {/* Responsive Logo Text */}
      <span className="text-lg sm:text-xl md:text-2xl font-bold">
        Shine<span className="text-blue-500">Spec</span>
      </span>
    </div>
  </Link>
</div>



        {/* Desktop Auth Buttons or User */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              {/* User initials avatar */}
              <Link to="/dashboard">
                <div
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer hover:bg-blue-700 transition"
                  title={`${user.name} ${user.lastname} (${user.email})`}
                >
                  {getInitials(user)}
                </div>
              </Link>
              {/*<button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>*/}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-5 py-2.5 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-300">
                  Login
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>


        {/* Mobile Menu Toggle + Mobile Profile */}
        <div className="md:hidden flex items-center">

{/* Login button visible ONLY when user is NOT logged in */}
{!user && (
  <Link to="/login">
    <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all">
      Login
    </button>
  </Link>
)}

{/* User profile ONLY when logged in */}
{user && (
  <Link to="/dashboard">
    <div
      className="ml-3 w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer hover:bg-blue-600 transition"
      title={`${user.name} ${user.lastname}`}
    >
      {getInitials(user)}
    </div>
  </Link>
)}
</div>


      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    {getInitials(user)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">{user.name} {user.lastname}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button
                    className="w-full py-3 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/sign-up">
                  <button
                    className="w-full py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
