
import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { Loader2, Utensils, Calendar, AlertTriangle } from "lucide-react";
import StaffNavbar from "../StaffComponents/StaffNavbar";
import OrderCard from "../StaffPages/SttaffOrderCard";
import ReservationCard from "../StaffPages/StaffReservationCard";

const StaffDashboard = () => {
  const [newOrders, setNewOrders] = useState([]);
  const [newReservations, setNewReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to track loading/action on a specific card (for disabling buttons)
  const [cardLoading, setCardLoading] = useState({ id: null, action: null });

  //  Function to Fetch All Pending Data
  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch New Orders
      const orderRes = await api.get("/staff/orders/new");
      setNewOrders(orderRes.data.orders || orderRes.data); 

      // Fetch New Reservations
      const resRes = await api.get("/staff/reservations/new");
      setNewReservations(resRes.data.reservations || resRes.data); 

      toast.info("Dashboard data refreshed!", { autoClose: 1000 });
    } catch (error) {
      toast.error("Failed to load dashboard data. Check API connection.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  //  Fetch Data on Component Mount and set up Polling (Auto-Refresh)
  useEffect(() => {
    fetchDashboardData();
    // Set up polling to refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Handles Accepting or Rejecting an Order
  const handleOrderAction = async (orderId, action) => {
    setCardLoading({ id: orderId, action: action });
    const endpoint = `/staff/orders/${orderId}/${action}`;
    // orderId is the MongoDB _id string, so .slice works
    const successMsg = `Order #${orderId.slice(-6)} ${
      action === "accept" ? "accepted!" : "rejected."
    }`;
    const errorMsg = `Error ${action}ing order #${orderId.slice(-6)}.`;

    try {
      await api.put(endpoint);
      toast.success(successMsg);
      // Filter must use order._id to compare against the handled orderId
      setNewOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      toast.error(errorMsg);
      console.error(errorMsg, error);
    } finally {
      setCardLoading({ id: null, action: null });
    }
  };

  // Handles Accepting or Declining a Reservation
  const handleReservationAction = async (resId, action) => {
    setCardLoading({ id: resId, action: action });
    const endpoint = `/staff/reservations/${resId}/${action}`; 
    const successMsg = `Reservation #${resId.slice(-6)} ${
      action === "accept" ? "confirmed!" : "declined."
    }`;
    const errorMsg = `Error ${action}ing reservation #${resId.slice(-6)}.`;

    try {
      await api.put(endpoint);
      toast.success(successMsg);
      //  Filter must use res._id to compare against the handled resId
      setNewReservations((prev) => prev.filter((res) => res._id !== resId));
    } catch (error) {
      toast.error(errorMsg);
      console.error(errorMsg, error);
    } finally {
      setCardLoading({ id: null, action: null });
    }
  };

  // Loading State for Initial Fetch
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-gray-600">
          Loading live operations data...
        </p>
      </div>
    );
  }

  // Main Dashboard Render
  return (
    <div className="min-h-screen bg-slate-50">
      <StaffNavbar />
      {/*  position from "top-right" to "bottom-center" */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          <AlertTriangle className="w-7 h-7 inline-block mr-3 text-red-500" />
          Pending Tasks Overview
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Queue Section */}
          <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <Utensils className="mr-3" /> New Orders ({newOrders.length})
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {newOrders.length > 0 ? (
                newOrders.map((order) => (
                  <OrderCard
                    //  Use MongoDB's unique identifier: _id
                    key={order._id}
                    order={order}
                    // Pass the correct _id to the handler
                    onAccept={() => handleOrderAction(order._id, "accept")}
                    onReject={() => handleOrderAction(order._id, "reject")}
                    isLoading={cardLoading}
                  />
                ))
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-center">
                  No new orders currently in the queue!
                </div>
              )}
            </div>
          </div>

          {/* Reservation Requests Section */}
          <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-emerald-600">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center">
              <Calendar className="mr-3" /> Pending Reservations (
              {newReservations.length})
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {newReservations.length > 0 ? (
                newReservations.map((res) => (
                  <ReservationCard
                    //  Use MongoDB's unique identifier: _id
                    key={res._id}
                    reservation={res}
                    // Pass the correct _id to the handler
                    onAccept={() => handleReservationAction(res._id, "accept")}
                    onDecline={() =>
                      handleReservationAction(res._id, "decline")
                    }
                    isLoading={cardLoading}
                  />
                ))
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-center">
                  No pending reservation requests!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
