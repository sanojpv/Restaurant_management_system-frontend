import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../StaffComponents/StaffNavbar.jsx";
import { Link } from "react-router-dom";

const StaffMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = async () => {
    try {
      const res = await api.get("/menu/getmenu");
      setMenuItems(res.data.menuItems || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const res = await api.put(`/menu/${id}/availability`, {
        isAvailable: !currentStatus,
      });

      // Update UI immediately
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isAvailable: !currentStatus } : item
        )
      );

      toast.success(res.data.message || "Status updated");
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <ToastContainer position="top-right" autoClose={1500} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Back Button */}
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <Link
            to="/staff"
            className="bg-emerald-700 rounded-md px-4 py-2 text-white font-medium hover:bg-emerald-800 transition"
          >
            ⇐ Back to Dashboard
          </Link>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center w-full sm:w-auto mt-4 sm:mt-0">
            🍽️ Manage Food Availability
          </h2>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : menuItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No menu items found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative w-full h-48 sm:h-52 md:h-56">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-between flex-grow p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="font-bold text-emerald-600 text-xl">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        item.isAvailable ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Not Available"}
                    </span>

                    <button
                      onClick={() =>
                        handleToggleAvailability(item._id, item.isAvailable)
                      }
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="text-green-500" size={28} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={28} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffMenu;
