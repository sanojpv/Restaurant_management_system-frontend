import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Utensils, User, LogOut, Menu, X } from "lucide-react";

const StaffNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = "/staff/dashboard";
  const loginPath = "/login";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate(loginPath);
  };

  return (
    <nav className="bg-emerald-700 shadow-lg sticky top-0 z-50 w-full">
      {/* Full-width container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* LEFT: Logo / Branding */}
        <Link
          to={dashboardPath}
          className="flex items-center space-x-2 text-xl sm:text-2xl font-extrabold text-white hover:text-emerald-200 transition duration-150"
        >
          <Utensils className="w-6 h-6" />
          <span>Fork & Flame Staff Dashboard</span>
        </Link>

        {/* RIGHT: Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => navigate("/staffprofile")}
            className="flex items-center px-3 py-2 text-white rounded-lg font-semibold hover:bg-emerald-600 transition duration-150"
          >
            <User className="mr-2 w-5 h-5" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-white rounded-lg font-semibold border-2 border-red-400 bg-red-600 hover:bg-red-700 hover:border-red-600 transition duration-150 shadow-md"
          >
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </button>
        </div>

        {/* RIGHT: Hamburger Icon (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-800 px-4 py-3 space-y-3 shadow-lg">
          <button
            onClick={() => {
              navigate("/staffprofile");
              setIsMenuOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-white rounded-lg font-semibold hover:bg-emerald-600 transition duration-150"
          >
            <User className="mr-2 w-5 h-5" />
            Profile
          </button>

          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-white rounded-lg font-semibold border-2 border-red-400 bg-red-600 hover:bg-red-700 hover:border-red-600 transition duration-150 shadow-md"
          >
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default StaffNavbar;
