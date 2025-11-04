
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, Loader2, Users, Mail, User, Info, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetStaffs = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // --- Fetch all staff members ---
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/staff");
        setStaffData(response.data.staff || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setError(error.message || "Failed to fetch staff list");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  // --- Delete staff by ID ---
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete this staff member? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await api.delete(`/admin/staff/${id}`);
      toast.success("Staff deleted successfully ✅");

      // Remove the deleted staff from UI
      setStaffData((prev) => prev.filter((staff) => staff._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff ❌");
    } finally {
      setDeletingId(null);
    }
  };

  // --- Loading state  ---
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-800/50 rounded-2xl">
        <Loader2 className="animate-spin text-orange-500 mr-3" size={28} />
        <p className="text-xl text-gray-300 font-medium">Loading Staff Directory...</p>
      </div>
    );
  }

  // --- Error state  ---
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-800/50 rounded-2xl">
        <p className="text-red-400 font-semibold p-6 border border-red-500/50 bg-gray-900/50 rounded-xl shadow-xl">
          <AlertTriangle className="inline w-5 h-5 mr-2 text-red-500" />
          An Error Occurred: {error}
        </p>
      </div>
    );
  }

 
  return (
    <div className="p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-700/50 pb-5 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-500 flex items-center mb-4 sm:mb-0">
          <Users className="w-8 h-8 mr-4 text-indigo-500" />
          Staff Directory
        </h1>
        <span className="text-lg font-bold text-white bg-indigo-500 px-4 py-2 rounded-full shadow-lg shadow-orange-500/20">
          Total Active Staff: {staffData.length}
        </span>
      </div>

      {/* List Content */}
      {staffData.length === 0 ? (
        <div className="text-center p-12 bg-gray-700/30 rounded-xl border border-dashed border-gray-600">
          <p className="text-xl text-gray-400 font-medium">
            No staff members found in the system.
          </p>
        </div>
      ) : (
        <div className="shadow-2xl rounded-xl overflow-hidden ring-1 ring-gray-700/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              
              {/* Table Header */}
              <thead className="bg-gray-700/50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-black"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-black"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="hidden xl:table-cell px-3 py-3.5 text-left text-sm font-semibold text-black"
                  >
                    Staff ID
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="text-black">Actions</span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-gray-900">
                {staffData.map((staff) => (
                  <tr
                    key={staff._id}
                    className="hover:bg-gray-700/50 transition duration-150"
                  >
                    
                    {/* Name (Always Visible) */}
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      <User className="md:inline w-4 h-4 mr-2 text-rose-500 hidden sm:inline" />
                      {staff.name}
                    </td>

                    {/* Email (Visible on Medium+ Screens) */}
                    <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      <Mail className="inline w-4 h-4 mr-2 text-gray-500" />
                      <span className="truncate max-w-[150px] inline-block">{staff.email}</span>
                    </td>

                    {/* Position (Always Visible) */}
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="inline-flex items-center rounded-md bg-orange-500/20 px-2.5 py-1 text-xs font-semibold text-orange-400 ring-1 ring-inset ring-orange-500/30">
                        {staff.position || "Staff"}
                      </span>
                    </td>

                    {/* ID (Visible on Extra-Large Screens) */}
                    <td className="hidden xl:table-cell whitespace-nowrap px-3 py-4 text-xs text-gray-500 font-mono">
                      {staff._id}
                    </td>

                    {/* Action Button (Always Visible) */}
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleDelete(staff._id)}
                        disabled={deletingId === staff._id}
                        className={`inline-flex items-center justify-center p-2 rounded-lg text-white shadow-lg transition-colors duration-200 w-10 h-10 
                        ${
                          deletingId === staff._id
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        }`}
                        title={`Delete ${staff.name}`}
                      >
                        {deletingId === staff._id ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStaffs;