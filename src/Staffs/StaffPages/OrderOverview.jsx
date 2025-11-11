// orderoverview.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { ListChecks, Loader2, ArrowLeft } from "lucide-react";
import StaffNavbar from "../StaffComponents/StaffNavbar";
import { useNavigate } from "react-router-dom";

const OrderOverview = () => {
 const [allOrders, setAllOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 // Fetch all orders
 const fetchAllOrders = async () => {
  try {
   const response = await api.get("/staff/orders/all");
   setAllOrders(response.data.orders || response.data);
   toast.info("All orders loaded.", { autoClose: 1500 });
  } catch (error) {
   toast.error("Failed to load all orders.");
   console.error("Fetch All Orders error:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchAllOrders();
 }, []);

 if (loading) {
  return (
   <div className="flex flex-col justify-center items-center h-screen bg-slate-50 px-4 text-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    <p className="mt-3 text-lg text-gray-600">
     Loading all order history...
    </p>
   </div>
  );
 }

 // Helper functions
 const getStatusClass = (status) => {
  switch (status) {
   case "Pending":
    return "text-yellow-600 bg-yellow-100";
   case "Confirmed":
    return "text-blue-600 bg-blue-100";
   case "Delivered":
    return "text-green-600 bg-green-100";
   case "Cancelled":
    return "text-red-600 bg-red-100";
   default:
    return "text-gray-600 bg-gray-100";
  }
 };

 const getPaymentStatusClass = (status) => {
  switch (status) {
   case "Paid":
    return "text-green-600 bg-green-100";
   case "Awaiting Payment":
   case "Pending":
    return "text-yellow-600 bg-yellow-100";
   default:
    return "text-gray-600 bg-gray-100";
  }
 };

 const formatItems = (items) => {
  return items
   .map(
    (item) =>
     `${item.quantity} x ${item.item?.name || item.item?.slice(-4) || "Item"}`
   )
   .join(", ");
 };

 return (
  <div className="min-h-screen bg-slate-50">
   <StaffNavbar />

   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border-b pb-4 space-y-3 sm:space-y-0">
     <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
      <ListChecks className="w-6 sm:w-7 h-6 sm:h-7 mr-3 text-gary-800" />
      Order History & Overview ({allOrders.length})
     </h1>

     <button
      onClick={() => navigate("/staff")}
      className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 w-full sm:w-auto font-medium"
     >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back to Dashboard
     </button>
    </div>

    {/* Orders Table */}
    <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-800 text-sm sm:text-base">
      <thead className="bg-gray-50">
       <tr>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Order ID
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Customer
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Items
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Total (₹)
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Delivery
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Payment Status
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Order Status
        </th>
        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
         Date(MM/DD/YY)
        </th>
       </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
       {allOrders.map((order) => (
        <tr
         key={order._id}
         className="hover:bg-gray-50 transition duration-100"
        >
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
          #{order._id.slice(-6)}
         </td>
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
          {order.customerId?.name || "N/A"}
         </td>
         <td className="px-4 sm:px-6 py-4 text-gray-600 max-w-[180px] sm:max-w-xs truncate">
          {formatItems(order.items)}
         </td>
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
          ₹{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
         </td>
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
          {order.deliveryOption}
         </td>
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
          <span
           className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(
            order.paymentStatus
           )}`}
          >
           {order.paymentStatus}
          </span>
         </td>
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
          <span
           className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
            order.status
           )}`}
          >
           {order.status}
          </span>
         </td>
         <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
          {new Date(order.createdAt).toLocaleDateString()}
         </td>
        </tr>
       ))}
      </tbody>
     </table>

     {allOrders.length === 0 && (
      <div className="p-6 text-center text-blue-500">
       No orders found in the system.
      </div>
     )}
    </div>

    {/* Bottom Spacing for Mobile */}
    <div className="h-8 sm:h-12"></div>
   </div>
  </div>
 );
};

export default OrderOverview;