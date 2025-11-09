
import React from "react";
import {
 Clock,
 User,
 DollarSign,
 Check,
 X,
 ClipboardList,
 Loader2,
 Truck, 
} from "lucide-react";

const OrderCard = ({ 
  order, 
  onAccept, 
  onReject, 
  onDeliver, 
  onCancel, 
  isLoading,
  viewType = 'pending' 
}) => {
 
  console.log(OrderCard.orders);
  console.log(OrderCard.onAccept);
  console.log(OrderCard.isLoading);
  
  // Logic for loading state based on action
  const isProcessing = isLoading && isLoading.id === order._id;
  const isAccepting = isProcessing && isLoading.action === "accept";
  const isRejecting = isProcessing && isLoading.action === "reject";
  const isDelivering = isProcessing && isLoading.action === "deliver";
  const isCancellingCod = isProcessing && isLoading.action === "cancelCod";

  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isActionDisabled = isProcessing;

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
      {/* Header / ID */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h3 className="text-xl font-bold text-blue-700">
          Order #{order._id.slice(-6)}
        </h3>
     
        {(viewType === 'Pending' || viewType === 'pending') && (
          <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
            NEW
          </span>
        )}
        {viewType === 'cod' && (
          <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center">
            <Truck className="w-4 h-4 mr-1"/> COD - {order.status}
          </span>
        )}
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
        <p className="flex items-center text-sm font-bold">
          <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
          Total: ₹{order.totalAmount.toFixed(2)}
        </p>
        <p className="flex items-start text-sm pt-2">
          <ClipboardList className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          Items ({order.items.length}):
          <span className="ml-1 line-clamp-2">
            {order.items
              .map((item) => `${item.name} (x${item.quantity})`)
              .join(", ")}
             
              
          </span>
        </p>
      </div>

      {/* Action Buttons (PENDING VIEW) */}
      {(viewType === 'Pending' || viewType === 'pending') && (
        <div className="flex space-x-3 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => onAccept(order._id, 'accept')}
            disabled={isActionDisabled}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-150 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
          >
            {isAccepting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {isAccepting ? "Confirming..." : "Accept Order"}
          </button>

          <button
            onClick={() => onReject(order._id, 'reject')}
            disabled={isActionDisabled}
            className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isRejecting ? "..." : <X className="w-4 h-4" />}
          </button>
        </div>
      )}
      
      {/* Action Buttons (COD/DELIVERY VIEW) */}
      {viewType === 'cod' && (
        <div className="flex space-x-3 mt-5 pt-4 border-t border-slate-100">
          {/* Delivered Button */}
          <button
            onClick={() => onDeliver(order._id, 'deliver')}
            disabled={isActionDisabled}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-150 disabled:bg-green-400 disabled:cursor-not-allowed shadow-md"
          >
            {isDelivering ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {isDelivering ? "Processing..." : "Delivered"}
          </button>

          {/* Cancel Order Button */}
          <button
            onClick={() => onCancel(order._id, 'cancelCod')}
            disabled={isActionDisabled}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isCancellingCod ? "..." : <X className="w-4 h-4 mr-1" />}
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;