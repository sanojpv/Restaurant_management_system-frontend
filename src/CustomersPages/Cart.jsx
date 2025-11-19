import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// --- Checkout Panel Component ---
const CheckoutPanel = ({ total, handleProceedToPayment }) => (
  <div className="md:w-2/5 p-6 md:p-8 bg-gray-50 rounded-xl shadow-inner border border-gray-100 mt-8 md:mt-0">
    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
      <CreditCard className="w-5 h-5 mr-2 text-black" />
      Order Summary
    </h2>

    <div className="space-y-4">
      {/* Subtotal */}
      <div className="flex justify-between text-gray-700">
        <span>Subtotal</span>
        <span className="font-medium">₹{total}</span>
      </div>
      {/* Delivery (Simulated) */}
      <div className="flex justify-between text-gray-700 pb-4 border-b border-gray-200">
        <span>Delivery Charge</span>
        <span className="font-medium text-green-600">Free</span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-2xl font-bold">Total</h3>
        <span className="text-2xl font-bold text-blue-700">₹{total}</span>
      </div>
    </div>

    {/* Proceed to Payment Button */}
    <div className="mt-8">
      <button
        onClick={handleProceedToPayment}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.01]"
      >
        Check Out
      </button>
    </div>
  </div>
);

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/view");
      setCart(res.data.items || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        setCart([]);
        navigate("/login");
      } else console.error("Error fetching cart:", err);
    }
  };

  const handleRemove = async (menuItemId) => {
    try {
      await api.delete(`/cart/${menuItemId}`);
      fetchCart();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        setCart([]);
        navigate("/login");
      } else console.error("Error removing item:", err);
    }
  };

  const handleUpdateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(menuItemId);
      return;
    }

    try {
      // API call to update the quantity
      await api.put(`/cart/update`, {
        menuItemId,
        quantity: newQuantity,
      });

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.menuItem?._id === menuItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        setCart([]);
        navigate("/login");
      } else if (err.response?.status === 404) {
        console.error(
          "API Route Not Found: Check your backend router for the PUT /cart/update endpoint."
        );
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + (item.menuItem?.price || 0) * item.quantity,
    0
  );

  // Passes the total amount as state during navigation
  const handleProceedToPayment = () => {
    navigate("/payments", { state: { totalAmount: total } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-3 md:p-5 pt-10">
      <div className="mb-15">
        <Navbar />
      </div>

      <h1 className="text-3xl mt-2 sm:text-4xl font-light text-center text-gray-900 mb-5">
        Shopping <span className="font-semibold">Cart</span>
      </h1>

      {/* Main Content Area - Split Layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Panel: Cart Items (Takes full width on mobile, 3/5 on medium/large) */}
        <div className="w-full md:w-3/5 bg-white rounded-xl shadow-xl p-6 md:p-8">
          {cart.length === 0 ? (
            <p className="text-center text-lg text-gray-500 py-20">
              Your shopping card is empty
            </p>
          ) : (
            cart.map((item) =>
              item.menuItem ? (
                <div
                  key={item.menuItem._id}
                  className="flex flex-wrap items-center justify-between gap-y-3 py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-4 w-full sm:w-1/2 md:w-auto flex-grow">
                    <img
                      src={item.menuItem.image}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                      alt={item.menuItem.name}
                    />
                    <div className="min-w-0 flex-grow">
                      <h3 className="text-lg font-medium text-gray-800 truncate">
                        {item.menuItem.name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        #{item.menuItem._id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {/* Controls & Price  */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto md:w-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg mr-4">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.menuItem._id,
                            item.quantity - 1
                          )
                        }
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-l-lg transition duration-150"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <p className="px-2 font-medium text-sm text-gray-800">
                        {item.quantity}
                      </p>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.menuItem._id,
                            item.quantity + 1
                          )
                        }
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-r-lg transition duration-150"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Remove Button */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="text-lg font-semibold text-gray-900 min-w-[70px] text-right">
                        ₹
                        {((item.menuItem.price || 0) * item.quantity).toFixed(
                          2
                        )}
                      </span>
                      <button
                        onClick={() => handleRemove(item.menuItem._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition duration-150"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            )
          )}

          {/* Subtotal at the bottom of the left panel */}
          {cart.length > 0 && (
            <div className="flex justify-end items-center mt-6">
              <span className="text-xl font-semibold text-gray-800">
                Subtotal{" "}
                <span className="text-blue-600 ml-2">₹{total.toFixed(2)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Panel: Checkout / Order Summary */}
        {cart.length > 0 && (
          <CheckoutPanel
            total={total.toFixed(2)}
            handleProceedToPayment={handleProceedToPayment}
          />
        )}
      </div>
    </div>
  );
};

export default CartPage;
