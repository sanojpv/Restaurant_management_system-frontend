import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  ShoppingCart,
  Phone,
  Utensils,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLogoutEvent = () => setIsLoggedIn(false);
    window.addEventListener("auth-logout", handleLogoutEvent);
    return () => window.removeEventListener("auth-logout", handleLogoutEvent);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    toast.info("You’ve been logged out.");
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const getNavLinkClass = (path) => {
    const isActive =
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path));

    return `relative flex items-center gap-1 font-medium transition duration-300 py-2 px-3 rounded-lg ${
      isActive
        ? "text-white bg-emerald-700 shadow-inner"
        : "text-emerald-50 hover:text-white hover:bg-emerald-500/50"
    }`;
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-xl fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 w-full">

        {/* Left: Logo - stuck to edge */}
        <Link to="/" className="flex items-center space-x-2">
          <Utensils className="w-8 h-8 text-white animate-pulse-slow" />
          <span className="text-xl font-extrabold tracking-wider">
            Fork & Flame
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-1 lg:space-x-2 p-1 bg-emerald-700/50 rounded-xl shadow-inner">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={getNavLinkClass("/")}
            >
              <Home size={18} /> Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setMenuOpen(false)}
              className={getNavLinkClass("/menu")}
            >
              <Utensils size={18} /> Menu
            </Link>
            <Link
              to="/reservation"
              onClick={() => setMenuOpen(false)}
              className={getNavLinkClass("/reservation")}
            >
              <BookOpen size={18} /> Dine-In
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={getNavLinkClass("/cart")}
            >
              <ShoppingCart size={18} /> Cart
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={getNavLinkClass("/contact")}
            >
              <Phone size={18} /> Contact
            </Link>
          </div>
        </div>

        {/* Right: Auth Buttons (flush right edge) */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/customer/profile"
                className={getNavLinkClass("/customer/profile")}
              >
                <User size={18} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl flex items-center gap-1 text-sm font-semibold transition duration-150 shadow-md hover:shadow-lg"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-emerald-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition duration-150 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle (Right edge) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-emerald-500 transition duration-150"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-700 py-3 shadow-inner rounded-b-xl animate-fade-in">
          <div className="px-4 space-y-2 flex flex-col">
            <Link onClick={toggleMenu} to="/" className={getNavLinkClass("/")}>
              <Home size={18} /> Home
            </Link>
            <Link
              onClick={toggleMenu}
              to="/menu"
              className={getNavLinkClass("/menu")}
            >
              <Utensils size={18} /> Menu
            </Link>
            <Link
              onClick={toggleMenu}
              to="/reservation"
              className={getNavLinkClass("/reservation")}
            >
              <BookOpen size={18} /> Dine-In
            </Link>
            <Link
              onClick={toggleMenu}
              to="/cart"
              className={getNavLinkClass("/cart")}
            >
              <ShoppingCart size={18} /> Cart
            </Link>
            <Link
              onClick={toggleMenu}
              to="/contact"
              className={getNavLinkClass("/contact")}
            >
              <Phone size={18} /> Contact
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  onClick={toggleMenu}
                  to="/customer/profile"
                  className={getNavLinkClass("/customer/profile")}
                >
                  <User size={18} /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="mt-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl flex items-center justify-center gap-1 text-base font-semibold transition duration-150 shadow-md"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
                className="mt-2 bg-white text-emerald-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition duration-150 shadow-md"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
