import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  DollarSign,
  Loader2,
  ArrowLeft,
  Store,
  Bike,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const RAZORPAY_KEY_ID = "rzp_test_RaXdo73QgrRBkB";
const PaymentPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("delivery"); // Delivery/Pickup state
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const totalAmount = location.state?.totalAmount || 0;
  const formattedAmount = `₹${Number(totalAmount).toFixed(2)}`;

  const [dataLoading, setDataLoading] = useState(true);

  const fetchCartDetails = async () => {
    setDataLoading(true);
    try {
      const res = await api.get("/cart/view");
      if (res.data.items && res.data.items.length > 0) {
        setCartItems(
          res.data.items.map((item) => ({
            menuItemId: item.menuItem._id,
            quantity: item.quantity,
          }))
        );
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error fetching cart details for payment:", error);
      alert("Could not load cart details. Please log in again or try later.");
      navigate("/cart");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (totalAmount <= 0) {
      navigate("/cart");
      return;
    }
    fetchCartDetails();
  }, [totalAmount, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceed = async () => {
    if (!selectedOption || loading || !cartItems || !deliveryOption) {
      alert(
        "Please select delivery and payment options, and ensure cart is loaded."
      );
      return;
    }

    setLoading(true);

    try {
      // Create Order in the backend first
      const orderPayload = {
        items: cartItems.map((item) => ({
          item: item.menuItemId,
          quantity: item.quantity,
        })),
        totalAmount: totalAmount,
        paymentMethod: selectedOption,
        deliveryOption: deliveryOption, // Sending the delivery option to the backend
      };

      const createOrderRes = await api.post(
        "/orders/create-order",
        orderPayload
      );
      const orderId = createOrderRes.data.order._id;

      if (selectedOption === "cod") {
        // COD Flow
        alert(`Order ${orderId} placed successfully with Cash on Delivery!`);
        navigate("/menu", { state: { orderId: orderId, method: "COD" } });
      } else if (selectedOption === "online") {
        // Online Payment Flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Razorpay SDK failed to load.");
          return;
        }

        // Call backend to create a Razorpay Order ID
        const razorpayOrderRes = await api.post("/orders/razorpay-order", {
          amount: totalAmount,
          orderId: orderId,
        });

        const razorpayOrder = razorpayOrderRes.data;

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Restaurant Name",
          description: `Order Payment: ${orderId}`,
          order_id: razorpayOrder.id, // Razorpay's order ID
          handler: async function (response) {
            // Verify on backend
            setLoading(true);
            try {
              const verifyRes = await api.post("/orders/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              });

              if (verifyRes.data.success) {
                alert("Payment Successful!");
                navigate("/menu", {
                  state: { orderId: orderId, method: "Online" },
                });
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Payment verification failed:", error);
              alert("Payment verification failed. Check console.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: { color: "#4F46E5" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error(
        "Order/Payment processing failed:",
        error.response?.data || error
      );
      alert(
        `Failed to proceed: ${
          error.response?.data?.message ||
          "An unexpected server error occurred."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading || totalAmount <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <span className="ml-3 text-xl text-indigo-600">
          Loading Order Details...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100/50">
        {/* Header and Summary */}
        <div className="bg-slate-800 text-white p-6 sm:p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <CreditCard className="w-7 h-7" /> Finalize Order & Payment
            </h1>
            <p className="text-slate-300 mt-1">
              Select method and payment to complete your order.
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-300 text-sm">Amount Payable</p>
            <p className="text-4xl font-bold text-yellow-400">
              {formattedAmount}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {/* --- DELIVERY / PICKUP OPTION --- */}
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">
            1. Select Order Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Option: Delivery */}
            <div
              onClick={() => setDeliveryOption("delivery")}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                deliveryOption === "delivery"
                  ? "border-indigo-600 shadow-lg bg-indigo-50/50"
                  : "border-gray-200 hover:border-indigo-400 hover:shadow-md"
              }`}
            >
              <div className="flex items-start">
                <Bike className="w-7 h-7 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                    Home Delivery
                    {deliveryOption === "delivery" && (
                      <span className="ml-3 text-xs font-bold text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-full">
                        SELECTED
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Get your food delivered to your address.
                  </p>
                </div>
              </div>
            </div>

            {/* Option: Pick Up */}
            <div
              onClick={() => setDeliveryOption("pickup")}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                deliveryOption === "pickup"
                  ? "border-indigo-600 shadow-lg bg-indigo-50/50"
                  : "border-gray-200 hover:border-indigo-400 hover:shadow-md"
              }`}
            >
              <div className="flex items-start">
                <Store className="w-7 h-7 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                    Restaurant Pick Up
                    {deliveryOption === "pickup" && (
                      <span className="ml-3 text-xs font-bold text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-full">
                        SELECTED
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Collect your food directly from the restaurant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- PAYMENT OPTION --- */}
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">
            2. Choose Payment Option
          </h2>

          {/* Payment Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*  Cash on Delivery (COD) */}
            <div
              onClick={() => setSelectedOption("cod")}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedOption === "cod"
                  ? "border-indigo-600 shadow-lg bg-indigo-50/50"
                  : "border-gray-200 hover:border-indigo-400 hover:shadow-md"
              }`}
            >
              <div className="flex items-start">
                <Truck className="w-7 h-7 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                    Cash on Delivery (COD)
                    {selectedOption === "cod" && (
                      <span className="ml-3 text-xs font-bold text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-full">
                        SELECTED
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pay with cash or UPI at the time of delivery/pickup.
                  </p>
                </div>
              </div>
            </div>

            {/*Online Payment (Razorpay) */}
            <div
              onClick={() => setSelectedOption("online")}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedOption === "online"
                  ? "border-indigo-600 shadow-lg bg-indigo-50/50"
                  : "border-gray-200 hover:border-indigo-400 hover:shadow-md"
              }`}
            >
              <div className="flex items-start">
                <DollarSign className="w-7 h-7 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                    Online Payment (Razorpay)
                    {selectedOption === "online" && (
                      <span className="ml-3 text-xs font-bold text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-full">
                        SELECTED
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pay instantly using Credit Card, Debit Card, UPI, or Net
                    Banking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-slate-800 transition duration-150 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Cart
            </button>

            <button
              onClick={handleProceed}
              disabled={!selectedOption || loading || !deliveryOption}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 
                                ${
                                  !selectedOption || loading || !deliveryOption
                                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl"
                                }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {!selectedOption || !deliveryOption
                ? "Select Options to Proceed"
                : selectedOption === "cod"
                ? "Confirm COD Order"
                : "Proceed to Razorpay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
