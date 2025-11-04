import React, { useState } from "react";
import api from "../services/api";
import {
  Eye,
  EyeOff,
  UserPlus,
  User,
  Mail,
  Lock,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const staffRoles = ["waiter", "chef", "delivery boy", "receptionist"];

const CreateStaffs = () => {
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    position: staffRoles[0],
    role: "staff",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handledata = (e) => {
    setStaff((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/admin/staff", staff);
      toast.success(
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="text-teal-500 w-10 h-10 mb-2" />
          <p className="font-semibold text-lg text-gray-800">
            New Staff "{response.data.staff.name}" Created Successfully!
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 2000, //  Auto close after 2 seconds
          hideProgressBar: true,
          pauseOnHover: false,
          closeOnClick: false,
          draggable: false,
          transition: Slide,
          className: "custom-toast",
        }
      );

      // Reset form after success
      setStaff({
        name: "",
        email: "",
        role: "staff",
        position: staffRoles[0],
        password: "",
      });
    } catch (error) {
      toast.error(
        <div className="flex flex-col items-center justify-center text-center">
          <XCircle className="text-red-500 w-10 h-10 mb-2" />
          <p className="font-semibold text-gray-800">
            {error.response?.data?.message || "Failed to create staff"}
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: true,
          transition: Slide,
          className: "custom-toast",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-teal-50 px-4">
      {/* Toast container */}
      <ToastContainer closeButton={false} />
      <style>
        {`
          .Toastify__toast-container {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 9999 !important;
          }

          .custom-toast {
            background: white !important;
            border-radius: 1rem !important;
            padding: 1.5rem !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            animation: fadeInScale 0.4s ease-in-out, fadeOut 0.4s ease-in-out 1.8s forwards;
          }

          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes fadeOut {
            to { opacity: 0; transform: scale(0.9); }
          }
        `}
      </style>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create Staff Account
          </h2>
          <p className="text-gray-500 text-sm mt-1">Add a new team member</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              <User className="inline w-4 h-4 mr-2 text-teal-500" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={staff.name}
              onChange={handledata}
              placeholder="Jane Doe"
              className="w-full bg-gray-100 text-gray-800 p-3 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">
              <Mail className="inline w-4 h-4 mr-2 text-teal-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={staff.email}
              onChange={handledata}
              placeholder="staff@example.com"
              className="w-full bg-gray-100 text-gray-800 p-3 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">
              <Briefcase className="inline w-4 h-4 mr-2 text-teal-500" />
              Position
            </label>
            <select
              name="position"
              value={staff.position}
              onChange={handledata}
              className="w-full bg-gray-100 text-gray-800 p-3 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            >
              {staffRoles.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">
              <Lock className="inline w-4 h-4 mr-2 text-teal-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={staff.password}
                onChange={handledata}
                placeholder="********"
                className="w-full bg-gray-100 text-gray-800 p-3 pr-10 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3 rounded-md font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus />}
            {loading ? "Creating..." : "Create Staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffs;
