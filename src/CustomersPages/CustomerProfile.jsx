import React, { useEffect, useState } from "react";
import api from "../services/api";
import CustomerSidebar from "../CustomersPages/CustomerSidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showProfile, setShowProfile] = useState(false); // Hidden by default

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch customer profile
  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const stored = JSON.parse(localStorage.getItem("user") || "null");
        if (!stored || !token) {
          setMsg("Not logged in");
          return;
        }

        const res = await api.get("/customer/profile");
        const c = res.data.customer || res.data;
        setCustomer(c);
        setFormData({
          name: c.name || "",
          email: c.email || "",
          phone: c.phone || "",
        });
      } catch (err) {
        console.error(err);
        setMsg(err.response?.data?.message || "Failed to load profile");
      }
    };
    fetch();
  }, []);

  //  Input change handler
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  //  Save changes
  const handleSave = async () => {
    try {
      setSaving(true);
      setMsg("");
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (!stored || !stored._id) {
        setMsg("Session expired. Please login again.");
        setSaving(false);
        return;
      }

      const res = await api.patch("/customer/profile", formData);
      const updated = res.data.customer || res.data;
      setCustomer(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated successfully 🎉");
      setIsEditing(false);
    } catch (err) {
      console.error("update error", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = alert(
      "⚠️ Are you sure you want to permanently delete your account?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete("/customer/profile");
      toast.success("Account deleted successfully 🗑️");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (!customer)
    return <p className="p-6 text-center">{msg || "Loading profile..."}</p>;

  const isChildRoute = location.pathname !== "/customer/profile";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row mt-15">
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar /> {/* Sidebar */}
      <CustomerSidebar customer={customer} onLogout={handleLogout} />
      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        {/*Profile Toggle Button (always visible) */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all"
          >
            {showProfile ? "Hide Profile" : "Show Profile"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back to Home
          </button>
        </div>

        {/* Profile Section (Only visible when toggled) */}
        {showProfile && (
          <main className="bg-white p-6 rounded-lg shadow mb-6 transition-all duration-300">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">
              Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm capitalize">{field}</label>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`mt-1 w-full p-2 border rounded ${
                      isEditing ? "border-emerald-400" : "bg-gray-100"
                    }`}
                  />
                </div>
              ))}
            </div>

            {msg && (
              <div className="mt-4 text-sm text-center text-emerald-700">
                {msg}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>

              {/* Delete Account Button */}
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Delete Account
              </button>
            </div>
          </main>
        )}

        {/* Nested Routes */}
        <div>
          <Outlet context={{ customer }} />
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
