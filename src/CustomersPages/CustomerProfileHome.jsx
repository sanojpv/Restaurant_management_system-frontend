import React from "react";
import { ShoppingBag, Clock } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

const CustomerWelcome = () => {
  const { customer } = useOutletContext() || {};
  const userName = customer?.name || "Customer";

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div
        className="
     p-8 md:p-12 bg-white rounded-2xl 
     shadow-xl 
     text-center 
     max-w-6xl w-full
     border border-gray-100
    "
      >
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome Back, <span className="text-emerald-600">{userName}</span>!
          </h2>

          <p className="text-lg text-gray-500 mb-10 font-normal">
            Your personalized control panel awaits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 justify-center">
            <Link
              to="orders"
              className="group relative p-8 bg-white rounded-xl 
              flex flex-col items-center justify-center 
              transition-all duration-300
              shadow-lg hover:shadow-xl
              transform hover:scale-[1.03]
              text-gray-900 font-semibold
              border border-gray-200
              cursor-pointer"
            >
              <Clock className="w-8 h-8 mb-4 text-emerald-600 transition-colors group-hover:text-emerald-700" />
              <span className="text-xl mb-1">Order History</span>
              <span className="text-sm font-normal text-gray-500">
                Track your past purchases
              </span>
            </Link>

            <Link
              to="/menu"
              className="group relative p-8 bg-white rounded-xl 
              flex flex-col items-center justify-center 
              transition-all duration-300
              shadow-xl shadow-emerald-200/50 hover:shadow-2xl hover:shadow-emerald-300/60
              transform hover:scale-[1.05]
              text-gray-800 font-semibold
              cursor-pointer"
            >
              <ShoppingBag className="w-8 h-8 mb-4 text-emerald-600 transition-colors group-hover:text-emerald-700" />
              <span className="text-xl mb-1">Place a New Order</span>
              <span className="text-sm font-normal  text-gray-500">
                Explore our delicious menu
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWelcome;
