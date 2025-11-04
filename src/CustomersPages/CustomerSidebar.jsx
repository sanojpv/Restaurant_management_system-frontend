import React from "react";
import {
  User,
  ShoppingBag,
  CreditCard,
  Settings,
  ShoppingCart,
  LogOut,
  HandPlatter,
} from "lucide-react";
import { Link } from "react-router-dom";

const CustomerSidebar = ({ customer, onLogout }) => {
  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition duration-200 ${
      isActive
        ? "text-yellow-300 border-b-2 border-yellow-300"
        : "text-white hover:text-yellow-200"
    }`;

  return (
    <aside className="bg-white p-6 rounded-lg shadow h-fit">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-emerald-100 p-3 rounded-full">
          <User className="text-emerald-700" />
        </div>
        <div>
          <div className="font-bold">{customer.name}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      </div>

      <nav className="space-y-2">
        <Link
          to="orders"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-300"
        >
          <ShoppingBag /> Orders
        </Link>

        <Link
          to="cart"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-300"
        >
          <ShoppingCart />
          Cart
        </Link>
        <Link
          to="reservationdetails"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-300"
        >
          <HandPlatter />
          Reservations
        </Link>
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 w-full text-left p-2 rounded hover:bg-red-50 text-red-600 flex items-center gap-2"
      >
        <LogOut /> Logout
      </button>
    </aside>
  );
};

export default CustomerSidebar;
