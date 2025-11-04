import React from "react";
import {
  Clock,
  User,
  DollarSign,
  Check,
  X,
  ClipboardList,
  Loader2,
} from "lucide-react";

const OrderCard = ({ order, onAccept, onReject, isLoading }) => {
  //  Use order._id to determine button state
  const isAccepting =
    isLoading && isLoading.id === order._id && isLoading.action === "accept";
  const isRejecting =
    isLoading && isLoading.id === order._id && isLoading.action === "reject";

  // Format the timestamp for better readability
  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
      {/* Header / ID */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        {/* Use order._id here to display the truncated ID */}
        <h3 className="text-xl font-bold text-blue-700">
          Order #{order._id.slice(-6)}
        </h3>
        <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
          NEW
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-slate-700">
        <p className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-blue-500" />
          Time: {orderTime}
        </p>
        <p className="flex items-center text-sm">
          <User className="w-4 h-4 mr-2 text-blue-500" />
          Customer: {order.customerName || "Walk-in Customer"}
        </p>
        <p className="flex items-center text-sm">
          <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
          Total: ₹{order.totalAmount.toFixed(2)}
        </p>
        <p className="flex items-start text-sm pt-2">
          <ClipboardList className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          Items ({order.items.length}):**
          <span className="ml-1 line-clamp-2">
            {order.items
              .map((item) => `${item.name} (x${item.quantity})`)
              .join(", ")}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-5 pt-4 border-t border-slate-100">
        <button
          //Pass order._id to the handler
          onClick={() => onAccept(order._id)}
          disabled={isAccepting || isRejecting}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-150 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
        >
          {isAccepting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {isAccepting ? "Processing..." : "Accept Order"}
        </button>

        <button
          // Pass order._id to the handler
          onClick={() => onReject(order._id)}
          disabled={isAccepting || isRejecting}
          className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRejecting ? "..." : <X className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
