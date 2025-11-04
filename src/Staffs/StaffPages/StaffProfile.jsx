import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { User, Mail, IdCard, Tag, Loader2, Info, ArrowLeft } from "lucide-react";

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

        const response = await api.get(`staff/profile/${id}`);
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
console.log(staff);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <p className="text-lg text-gray-700 font-medium">
          Loading profile data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center p-5 bg-red-100 border border-red-200 rounded-xl shadow-md max-w-md">
          <Info className="w-6 h-6 text-red-600 mr-3" />
          <p className="text-base text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-10 sm:px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-gray-300/60 transition-shadow duration-300">
        
        {/* Header Section */}
        <div className="bg-emerald-600 p-6 sm:p-8 text-white text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            Staff Profile
          </h2>
          <p className="mt-2 text-sm sm:text-base text-indigo-100">
            Detailed information
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10">
          <dl className="divide-y divide-gray-100">
            {/* Name */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Name
              </dt>
              <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0">
                {staff.name || "N/A"}
              </dd>
            </div>

            {/* Email */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                Email
              </dt>
              <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0 truncate">
                {staff.email || "N/A"}
              </dd>
            </div>

            {/* Staff ID */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                <IdCard className="w-4 h-4 mr-2 text-indigo-600" />
                Staff ID
              </dt>
              <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0">
                {staff._id || "N/A"}
              </dd>
            </div>

            {/* Role */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center text-sm sm:text-base font-medium text-gray-500">
                <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                Role
              </dt>
              <dd className="mt-1 text-lg sm:text-xl font-semibold text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
                {staff.position || "N/A"}
              </dd>
            </div>
          </dl>

          {/* Back Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate("/staff")}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg hover:scale-105 transform transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
