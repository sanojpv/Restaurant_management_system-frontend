

import { Outlet, NavLink, useNavigate, useMatch } from "react-router-dom";
import {
  Gauge,
  Users,
  UserPlus,
  ClipboardList,
  Settings,
  LogOut,
  X,
  Menu,
  ChevronRight,
  Bell,
  Search,
  Calendar,
  Loader2,
  Info,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

const AdmiDashboard = () => {
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch Admin Profile
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/profile");
        setAdmin(response.data.admin || {});
        setError(null);
      } catch (error) {
        console.error("Error fetching admin:", error);
        setError(error.response?.data?.message || "Failed to load profile");

        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  // Custom NavItem Component
  const NavItem = ({ to, icon: Icon, children }) => {
    const match = useMatch({ path: to, end: false }); 

    return (
      <NavLink
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
          match
            ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-lg shadow-teal-500/30 font-bold"
            : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-800"
        }`}
      >
        <Icon size={20} className="relative z-10" />
        <span className="relative z-10 flex-1 text-left truncate">{children}</span>
        {match && (
          <ChevronRight
            size={18}
            className="relative z-10 animate-pulse text-white"
          />
        )}
      </NavLink>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Loader2 className="animate-spin text-teal-500 mr-3" size={32} />
        <div className="text-xl font-medium text-gray-700">
          Loading Admin Portal...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center p-8 bg-white border-2 border-red-500 rounded-xl shadow-lg">
          <div className="text-2xl text-red-500 font-bold mb-4">
            <Info className="inline w-6 h-6 mr-2" />
            Connection Error
          </div>
          <p className="text-gray-700 mb-6">
            Failed to load profile: <b>{error}</b>. Please check your credentials.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                F
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Fork & Flame
                </h2>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {admin.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-800 truncate">
                  {admin.name || "Admin User"}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {admin.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider px-4 mb-3">
                Main Menu
              </h4>
              <NavItem to="adprofile" icon={Users}>
                Profile
              </NavItem>
              <NavItem to="dashboard" icon={Gauge}>
                Dashboard
              </NavItem>
              <NavItem to="getcustomers" icon={Users}>
                Customers
              </NavItem>
              <NavItem to="creatstaff" icon={UserPlus}>
                Add Staff
              </NavItem>
              <NavItem to="getstaffs" icon={ClipboardList}>
                Staff Directory
              </NavItem>
              <NavItem to="creatmenu" icon={ClipboardList}>
               Creat Menu
              </NavItem>
              <NavItem to="deletemenu" icon={Trash2}>
               Delete & Edit MenuItem
              </NavItem>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider px-4 mb-3">
                System
              </h4>
              <NavItem to="settings" icon={Settings}>
                Settings
              </NavItem>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-red-500 w-full hover:bg-red-500/10 hover:text-red-600 group"
            >
              <LogOut
                size={20}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b p-4 sm:px-6 border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Toggle menu"
              >
                <Menu size={24} className="text-gray-600" />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                  Welcome back, {admin.name?.split(" ")[0] || "Admin"}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600">
                <Search size={18} />
                <span className="text-sm">Search</span>
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              </button>
              <div className="sm:hidden w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {admin.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md p-3 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdmiDashboard;
