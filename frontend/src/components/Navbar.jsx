import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Company", href: "#company" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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
        <div className="flex items-center text-xl sm:text-2xl font-bold text-gray-900">
          <Link to="/">
            <div className="flex items-center justify-center text-gray-900">
              <img
                src="/logo-ShineSpec.png"
                alt="ShineSpec Logo"
                className="h-10 sm:h-12 w-auto"
              />
              Shine<span className="text-blue-500">Spec</span>
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
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
