

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import {
  User,
  Mail,
  Save,
  Loader2,
  Pencil,
  X,
  CheckCircle,
  XCircle,
  IdCard,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Admin_Profile = () => {
  const [admin, setAdmin] = useState({ _id: "", name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/admin/profile");
        setAdmin(response.data.admin);
      } catch (error) {
        toast.error(
          <div className="flex items-center">
            <XCircle className="mr-2" /> Failed to load admin profile
          </div>,
          { position: "top-center" }
        );
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

 const handleSave = async (e) => {
 
  try {
   const admin_id = localStorage.getItem("id"); 
   const response = await api.put(`/admin/profile/${admin_id}`, { 
    name: admin.name,
    email: admin.email,
   });


      toast.success(
        <div className="flex items-center">
          <CheckCircle className="mr-2" /> {response.data.message}
        </div>,
        { position: "top-center" }
      );

      setEditing(false);
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <XCircle className="mr-2" />{" "}
          {error.response?.data?.message || "Failed to update profile"}
        </div>,
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Admin Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Admin ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <IdCard className="inline w-4 h-4 mr-2 text-teal-500" /> Admin ID
            </label>
            <input
              type="text"
              name="_id"
              value={admin._id}
              disabled
              className="w-full rounded-md bg-gray-100 text-gray-500 p-3 cursor-not-allowed border border-gray-200"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <User className="inline w-4 h-4 mr-2 text-teal-500" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={admin.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full rounded-md p-3 border ${
                editing
                  ? "bg-white border-teal-400 focus:ring-2 focus:ring-teal-300 focus:border-teal-400"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              <Mail className="inline w-4 h-4 mr-2 text-teal-500" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full rounded-md p-3 border ${
                editing
                  ? "bg-white border-teal-400 focus:ring-2 focus:ring-teal-300 focus:border-teal-400"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition"
              >
                <Pencil size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-md font-semibold transition"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Admin_Profile;
