import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  User,
  Mail,
  IdCard,
  Tag,
  Loader2,
  Info,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../StaffComponents/StaffNavbar";

const StaffProfile = () => {
  const [staff, setStaff] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = localStorage.getItem("id");
        if (!id) throw new Error("Staff ID not found in local storage.");

        const response = await api.get(`staff/profile`);
        setStaff(response.data);
      } catch (err) {
        console.error("Error fetching staff profile:", err);
        setError("Failed to load profile data. Please try again.");
        setStaff({});
      } finally {
        setLoading(false);
      }
    };
    fetchStaffProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mr-3" />
        <p className="text-lg text-gray-700 font-medium">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="flex items-center p-5 bg-red-100 border border-red-200 rounded-xl shadow-md max-w-md w-full">
          <Info className="w-6 h-6 text-red-600 mr-3" />
          <p className="text-base text-red-800 font-medium">{error}</p>
        </div>
        <button
          onClick={() => navigate("/staff")}
          className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-emerald-600 p-6 sm:p-8 text-white text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold flex items-center justify-center gap-2">
              <User className="w-7 h-7 text-white" />
              Staff Profile
            </h2>
            <p className="mt-2 text-sm sm:text-base text-emerald-100">
              Detailed Information
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <dl className="divide-y divide-gray-100">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                  <User className="w-4 h-4 mr-2 text-emerald-600" />
                  Name
                </dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0 break-words">
                  {staff.name || "N/A"}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                  <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                  Email
                </dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0 break-all">
                  {staff.email || "N/A"}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                  <IdCard className="w-4 h-4 mr-2 text-emerald-600" />
                  Staff ID
                </dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0 break-words">
                  {staff._id || "N/A"}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                  <Tag className="w-4 h-4 mr-2 text-emerald-600" />
                  Role
                </dt>
                <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
                  {staff.role || "N/A"}
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => navigate("/staff")}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffProfile;
