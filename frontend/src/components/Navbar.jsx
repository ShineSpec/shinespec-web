import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import useAppUser from "../hooks/useAppUser";

const navItems = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Company", href: "#company" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  // Clerk decides signed-in vs signed-out. `profile` is the /me data cached by
  // ClerkAuthBridge and is only used for the name/email shown here.
  const { isLoaded, isSignedIn, profile } = useAppUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Falls back to Clerk's own data so the avatar shows immediately after sign-in,
  // without waiting for /api/auth/me.
  const user = isSignedIn
    ? {
        name: profile?.name || clerkUser?.firstName || "",
        lastname: profile?.lastname || clerkUser?.lastName || "",
        email: profile?.email || clerkUser?.primaryEmailAddress?.emailAddress || "",
      }
    : null;

  // Real logout: ends the Clerk session. ClerkAuthBridge then clears token/user.
  const handleLogout = async () => {
    setIsMenuOpen(false);
    await signOut({ redirectUrl: "/" });
  };

  const getInitials = (u) => {
    if (!u) return "";
    const first = u.name ? u.name.trim().charAt(0).toUpperCase() : "";
    const last = u.lastname ? u.lastname.trim().charAt(0).toUpperCase() : "";
    return `${first}${last}` || (u.email ? u.email.charAt(0).toUpperCase() : "?");
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

        {/* Desktop Auth Buttons or User.
            Empty (fixed-width) until Clerk has loaded, so the wrong buttons never flash. */}
        <div className="hidden md:flex items-center justify-end gap-3 min-w-[11rem] min-h-[2.75rem]">
          {!isLoaded ? null : user ? (
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
          {/* Login button visible ONLY once Clerk has loaded and nobody is signed in */}
          {isLoaded && !user && (
            <Link to="/login">
              <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all">
                Login
              </button>
            </Link>
          )}

          {/* User profile ONLY when signed in */}
          {isLoaded && user && (
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