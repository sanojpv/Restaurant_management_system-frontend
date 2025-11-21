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
          name: "FORK & FLAME 🍴",
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4 pt-20">
      <Navbar />

      {/* DESKTOP: wide | MOBILE: compact */}
      <div className="w-full max-w-3xl md:max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Checkout
        </h1>

        <p className="text-gray-600 text-center mt-1 mb-6">
          Final step before you enjoy your meal!
        </p>

        {/* Amount */}
        <div className="bg-gray-800 text-white text-center rounded-xl p-6 mb-8">
          <p className="text-sm opacity-80">Total Amount</p>
          <p className="text-4xl font-extrabold">{formattedAmount}</p>
        </div>

        {/* Delivery / Pickup */}
        <p className="font-semibold text-gray-800 mb-2">Order Method</p>

        <div className="flex gap-3 mb-7">
          <button
            onClick={() => setDeliveryOption("delivery")}
            className={`flex-1 py-2 rounded-lg text-sm border flex items-center justify-center gap-2
              ${
                deliveryOption === "delivery"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
          >
            <Bike size={16} /> Delivery
          </button>

          <button
            onClick={() => setDeliveryOption("pickup")}
            className={`flex-1 py-2 rounded-lg text-sm border flex items-center justify-center gap-2
              ${
                deliveryOption === "pickup"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
          >
            <Store size={16} /> Pickup
          </button>
        </div>

        {/* Payment */}
        <p className="font-semibold text-gray-800 mb-2">Payment Method</p>

        <div className="flex flex-col md:flex-row gap-4 mb-10">

          {/* COD – big on desktop */}
          <button
            onClick={() => setSelectedOption("cod")}
            className={`flex-1 py-3 md:py-5 rounded-lg text-sm md:text-lg border flex items-center justify-center gap-3
              ${
                selectedOption === "cod"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
          >
            <HandPlatter size={20} /> Cash on Delivery
          </button>

          {/* Online – big on desktop */}
          <button
            onClick={() => setSelectedOption("online")}
            className={`flex-1 py-3 md:py-5 rounded-lg text-sm md:text-lg border flex items-center justify-center gap-3
              ${
                selectedOption === "online"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
          >
            <CreditCard size={20} /> Online Payment
          </button>
        </div>

        
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-black flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            onClick={handleProceed}
            disabled={!selectedOption || loading}
            className={`px-6 py-3 rounded-lg font-semibold text-sm
              ${
                !selectedOption || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-emerald-600 text-white cursor-pointer"
              }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentPage;
