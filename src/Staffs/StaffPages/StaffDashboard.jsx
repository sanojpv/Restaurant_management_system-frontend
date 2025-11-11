import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import {
  Loader2,
  Utensils,
  Calendar,
  AlertTriangle,
  ListChecks,
} from "lucide-react";
import StaffNavbar from "../StaffComponents/StaffNavbar";
import OrderCard from "../StaffPages/SttaffOrderCard";
import ReservationCard from "../StaffPages/StaffReservationCard";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const [newOrders, setNewOrders] = useState([]);
  const [newReservations, setNewReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState({ id: null, action: null });

  const navigate = useNavigate();
  const goToOrderOverview = () => navigate("/staffoverview");

  //  Fetch both new orders and pending reservations
  const fetchDashboardData = useCallback(async () => {
    if (newOrders.length === 0 && newReservations.length === 0) setLoading(true);
    try {
      const orderRes = await api.get("/staff/orders/new");
      setNewOrders(orderRes.data.orders || []);

      const resRes = await api.get("/staff/reservations/new");
      setNewReservations(resRes.data.reservations || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [newOrders.length, newReservations.length]);

  //  Handle order actions (Accept, Deliver, Reject, Cancel)
  const handleOrderAction = async (orderId, action) => {
    setCardLoading({ id: orderId, action });
    const endpoint = `/staff/orders/${orderId}/${action}`;
    const successMsg = `Order #${orderId.slice(-6)} ${
      action === "accept"
        ? "confirmed!"
        : action === "deliver"
        ? "delivered!"
        : action === "reject"
        ? "rejected."
        : "cancelled."
    }`;

    try {
      const res = await api.put(endpoint);
      toast.success(successMsg);

      if (action === "accept") {
        // Update order status but keep it in the list
        setNewOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? res.data.order : order
          )
        );
      } else if (action === "deliver" || action === "reject" || action === "cancelCod") {
        // Remove delivered/rejected/cancelled orders
        setNewOrders((prev) => prev.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      toast.error(`Error ${action}ing order #${orderId.slice(-6)}.`);
      console.error(error);
    } finally {
      setCardLoading({ id: null, action: null });
    }
  };

  //  Handle reservation actions (Accept / Decline)
  const handleReservationAction = async (resId, action) => {
    setCardLoading({ id: resId, action });
    const endpoint = `/staff/reservations/${resId}/${action}`;
    const successMsg = `Reservation #${resId.slice(-6)} ${
      action === "accept" ? "confirmed!" : "declined."
    }`;

    try {
      await api.put(endpoint);
      toast.success(successMsg);
      setNewReservations((prev) => prev.filter((r) => r._id !== resId));
    } catch (error) {
      toast.error(`Error ${action}ing reservation #${resId.slice(-6)}.`);
      console.error(error);
    } finally {
      setCardLoading({ id: null, action: null });
    }
  };

  //  Fetch data every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  //  Loading screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 px-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="mt-3 text-lg text-gray-600">Loading Staff Dashboard...</p>
      </div>
    );
  }

  // Main Dashboard UI
  return (
    <div className="min-h-screen bg-slate-50">
      <StaffNavbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        {/*  Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border-b pb-4 space-y-3 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
            <AlertTriangle className="w-6 sm:w-7 h-6 sm:h-7 mr-3 text-red-500" />
            Pending Tasks Overview
          </h1>

          <button
            onClick={goToOrderOverview}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-150 shadow-md w-full sm:w-auto justify-center"
          >
            <ListChecks className="w-5 h-5 mr-2" />
            View All Orders
          </button>
        </div>

        {/*  Orders & Reservations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/*  Orders Section */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border-t-4 border-blue-600 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6 flex items-center">
              <Utensils className="mr-3" />
              New & Confirmed Orders ({newOrders.length})
            </h2>

            <div className="space-y-4 overflow-y-auto pr-2 max-h-96 lg:max-h-[70vh]">
              {newOrders.length > 0 ? (
                newOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onAccept={(id) => handleOrderAction(id, "accept")}
                    onReject={(id) => handleOrderAction(id, "reject")}
                    onDeliver={(id) => handleOrderAction(id, "deliver")}
                    onCancel={(id) => handleOrderAction(id, "cancelCod")}
                    isLoading={cardLoading}
                  />
                ))
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-center">
                  No active orders currently in the queue!
                </div>
              )}
            </div>
          </div>

          {/*  Reservations Section */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border-t-4 border-emerald-600 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-4 sm:mb-6 flex items-center">
              <Calendar className="mr-3" />
              Pending Reservations ({newReservations.length})
            </h2>

            <div className="space-y-4 overflow-y-auto pr-2 max-h-96 lg:max-h-[70vh]">
              {newReservations.length > 0 ? (
                newReservations.map((res) => (
                  <ReservationCard
                    key={res._id}
                    reservation={res}
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
