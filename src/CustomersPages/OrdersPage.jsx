import React, { useState, useEffect } from "react";
import api from "../services/api";

import {
  History,
  ShoppingBag,
  Loader2,
  DollarSign,
  Package,
  MapPin,
  Bike,
  Store,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://restaurant-management-system-1-rnh4.onrender.com";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "paid":
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "pending":
    case "awaiting payment":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error(
          "Failed to fetch order history:",
          err.response?.data?.message || err.message
        );
        if (err.response && err.response.status === 401) {
          setError("Session expired or unauthorized. Please log in again.");
        } else {
          setError(
            "Failed to load order history. Please check your network or try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg text-gray-600">
          Loading your order history...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-8">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  // No orders
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <History className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">
          No Past Orders Found
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven't placed any orders yet.
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="mt-6 bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // Order list
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 border-b pb-3 flex items-center gap-3">
          <History className="w-8 h-8 text-gray-800" /> Your Order History
        </h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-2xl border border-gray-100/50 overflow-hidden transform hover:scale-[1.01] transition duration-300"
            >
              {/* Header */}
              <div className="bg-slate-800 text-white p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-indigo-300">Order ID</p>
                  <p className="text-base font-medium mt-0.5">
                    {order._id.slice(-10)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-indigo-300">Date Placed</p>
                  <p className="text-base font-medium mt-0.5">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-indigo-300">Delivery Type</p>
                  <div className="flex items-center mt-0.5">
                    {order.deliveryOption === "delivery" ? (
                      <Bike className="w-4 h-4 mr-2 text-green-400" />
                    ) : (
                      <Store className="w-4 h-4 mr-2 text-yellow-400" />
                    )}
                    <span className="capitalize font-bold text-white">
                      {order.deliveryOption === "cod"
                        ? "Cash"
                        : order.deliveryOption}
                    </span>
                  </div>
                </div>

                <div className="text-right md:text-left">
                  <p className="text-sm text-indigo-300">Order Status</p>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider mt-0.5 inline-block ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Totals */}
                <div className="md:col-span-1 border-r pr-6 border-gray-100 space-y-3">
                  <div className="flex justify-between font-bold text-lg text-slate-800 pt-1 border-t border-gray-100">
                    <span>Total:</span>
                    <span className="text-indigo-700">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-800">Payment :</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-gray-800">Pmt Status:</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-pink-600" />
                    <span className="font-bold text-gray-800">Type:</span>
                    <span className="capitalize font-medium text-slate-700">
                      {order.deliveryOption}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="md:col-span-3">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-indigo-600" /> Items
                    Ordered ({order.items.length})
                  </h3>

                  <div className="max-h-52 overflow-y-auto pr-2 space-y-3">
                    {order.items.map((cartItem, itemIndex) => {
                      const item = cartItem.item; // store shorter variable

                      return (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center">
                            {item?.image && (
                              <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item?.name || "Item"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <span className="font-medium text-slate-800">
                              {cartItem.quantity}x {item?.name || "Unknown Item"}
                            </span>
                          </div>

                          <span className="font-semibold text-gray-900">
                            ₹
                            {(
                              cartItem.quantity *
                              (item?.price || 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;








// import React, { useState, useEffect } from "react";
// import api from "../services/api";

// import {
//   History,
//   ShoppingBag,
//   Loader2,
//   DollarSign,
//   Package,
//   MapPin,
//   Bike,
//   Store,
// } from "lucide-react";
// import { format } from "date-fns";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = "https://restaurant-management-system-1-rnh4.onrender.com"

// const getStatusColor = (status) => {
//   switch (status.toLowerCase()) {
//     case "delivered":
//     case "paid":
//     case "confirmed":
//       return "bg-green-100 text-green-800";
//     case "shipped":
//       return "bg-blue-100 text-blue-800";
//     case "pending":
//     case "awaiting payment":
//       return "bg-yellow-100 text-yellow-800";
//     case "cancelled":
//       return "bg-red-100 text-red-800";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

// const OrderHistoryPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await api.get("/orders/my-orders");
//         setOrders(response.data.orders);
//       } catch (err) {
//         console.error(
//           "Failed to fetch order history:",
//           err.response?.data?.message || err.message
//         );
//         if (err.response && err.response.status === 401) {
//           setError("Session expired or unauthorized. Please log in again.");
//         } else {
//           setError(
//             "Failed to load order history. Please check your network or try again."
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // --- Loading & Error States ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//         <p className="ml-3 text-lg text-gray-600">
//           Loading your order history...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 p-8">
//         <p className="text-xl font-semibold">{error}</p>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
//         <History className="w-12 h-12 text-gray-400 mb-4" />
//         <h2 className="text-2xl font-bold text-gray-700">
//           No Past Orders Found
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Looks like you haven't placed any orders yet.
//         </p>
//         <button
//           onClick={() => navigate("/menu")}
//           className="mt-6 bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-700 transition"
//         >
//           Start Shopping
//         </button>
//       </div>
//     );
//   }

//   // --- Order History Display ---
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//       <div className="w-full max-w-5xl mx-auto">
//         <h1 className="text-3xl font-extrabold text-slate-800 mb-8 border-b pb-3 flex items-center gap-3">
//           <History className="w-8 h-8 text-gray-800" /> Your Order History
//         </h1>

//         <div className="space-y-8">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white rounded-xl shadow-2xl border border-gray-100/50 overflow-hidden transform hover:scale-[1.01] transition duration-300"
//             >
//               <div className="bg-slate-800 text-white p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
//                 {/* Order ID & Date */}
//                 <div>
//                   <p className="text-sm text-indigo-300">Order ID</p>
//                   <p className="text-base font-medium mt-0.5">
//                     {order._id.slice(-10)}
//                   </p>
//                 </div>

//                 {/* Date */}
//                 <div>
//                   <p className="text-sm text-indigo-300">Date Placed</p>
//                   <p className="text-base font-medium mt-0.5">
//                     {format(new Date(order.createdAt), "MMM dd, yyyy")}
//                   </p>
//                 </div>

//                 {/* Delivery Option */}
//                 <div>
//                   <p className="text-sm text-indigo-300">Delivery Type</p>
//                   <div className="flex items-center mt-0.5">
//                     {order.deliveryOption === "delivery" ? (
//                       <Bike className="w-4 h-4 mr-2 text-green-400" />
//                     ) : (
//                       <Store className="w-4 h-4 mr-2 text-yellow-400" />
//                     )}
//                     <span className="capitalize font-bold text-white">
//                       {order.deliveryOption === "cod"
//                         ? "Cash"
//                         : order.deliveryOption}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Status Chip */}
//                 <div className="text-right md:text-left">
//                   <p className="text-sm text-indigo-300">Order Status</p>
//                   <span
//                     className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider mt-0.5 inline-block ${getStatusColor(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//               </div>

//               {/* Order Details & Items */}
//               <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//                 {/* Totals & Payment (Left Column) */}
//                 <div className="md:col-span-1 border-r pr-6 border-gray-100 space-y-3">
//                   {/* Total Amount */}
//                   <div className="flex justify-between font-bold text-lg text-slate-800 pt-1 border-t border-gray-100">
//                     <span>Total:</span>
//                     <span className="text-indigo-700">
//                       ₹{Number(order.totalAmount).toFixed(2)}
//                     </span>
//                   </div>

//                   {/* Payment Method (COD/Online) */}
//                   <div className="flex items-center gap-2 text-sm">
//                     <DollarSign className="w-4 h-4 text-green-600" />
//                     <span className="font-bold text-gray-800">Payment :</span>
//                     <span className="capitalize">{order.paymentMethod}</span>
//                   </div>

//                   {/* Payment Status */}
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Package className="w-4 h-4 text-indigo-600" />
//                     <span className="font-bold text-gray-800">Pmt Status:</span>
//                     <span
//                       className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
//                         order.paymentStatus
//                       )}`}
//                     >
//                       {order.paymentStatus}
//                     </span>
//                   </div>

//                   {/* Delivery/Pickup Option again for clarity */}
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <MapPin className="w-4 h-4 text-pink-600" />
//                     <span className="font-bold text-gray-800">Type:</span>
//                     <span className="capitalize font-medium text-slate-700">
//                       {order.deliveryOption}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Items List (Right Column) */}
//                 <div className="md:col-span-3">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
//                     <ShoppingBag className="w-5 h-5 text-indigo-600" /> Items
//                     Ordered ({order.items.length})
//                   </h3>
//                   <div className="max-h-52 overflow-y-auto pr-2 space-y-3">
//                     {order.items.map((cartItem, itemIndex) => (
//                       <div
//                         key={itemIndex}
//                         className="flex items-center justify-between text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
//                       >
//                         <div className="flex items-center">
//                           {/* Item Image */}
//                           {cartItem.item && cartItem.item.image ? (
//   <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
//     <img
//       src={cartItem.item.image}
//       alt={cartItem.item.name}
//       className="w-full h-full object-cover"
//     />
//   </div>
// ) : (
//   <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
//     No Image
//   </div>
// )}
//                           <span className="font-medium text-slate-800">
//                             {cartItem.quantity}x{" "}
//                             {cartItem.item.name || "Unknown Item"}
//                           </span>
//                         </div>
//                         <span className="font-semibold text-gray-900">
//                           ₹
//                           {(cartItem.quantity * cartItem.item.price).toFixed(2)}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderHistoryPage;
