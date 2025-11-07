
import React, { useState } from "react";
import tablebg from "../assets/resarvationtableimg.webp";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { CheckCircle, AlertTriangle, X, Loader2 } from "lucide-react";

const ReservationPage = () => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    partySize: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClosePopup = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!form.date || !form.time || !form.partySize) {
      setErrorMessage("Please select a date, time, and number of guests.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/reservation/create", form);
      console.log("Reservation successful:", res.data);

      setSuccessMessage(
        "Your table is booked! A confirmation email will be sent shortly."
      );

      // Clear form on success
      setForm({
        date: "",
        time: "",
        partySize: "",
      });
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
          "There was an issue with your reservation. Please ensure all details are correct."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Utility Classes ---
  const inputClass =
    "w-full border border-gray-300 p-3 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 transition duration-200 ease-in-out placeholder-gray-500 text-gray-800 bg-white/70 backdrop-blur-sm";

  const buttonClass =
    "w-full flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg transition duration-300 ease-in-out disabled:bg-indigo-400 cursor-pointer";

  return (
    <div>
      <Navbar />

      {/* --- Main Content Area with Background Image --- */}
      <div
        className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-cover bg-center"
        style={{
          backgroundImage: `url(${tablebg})`,
          filter: "brightness(0.9)",
        }}
      >
        {/* --- Glassmorphism Form Container --- */}
        <div
          className="w-full max-w-lg md:max-w-xl rounded-3xl p-6 sm:p-10 shadow-2xl transition duration-500"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 text-white drop-shadow-lg">
            Book Your Table
          </h2>
          <p className="text-center text-black mb-8 font-light sm:text-lg drop-shadow-md">
            Reserve your spot for an unforgettable dining experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Responsive Date/Time/Party Size Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className={inputClass + " text-gray-800"} // Ensure date picker text is visible
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className={inputClass + " text-gray-800"}
              />
              <input
                type="number"
                name="partySize"
                value={form.partySize}
                onChange={handleChange}
                min="1"
                max="12"
                required
                placeholder="Guests (1-12)" 
                className={inputClass}
              />
          
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={buttonClass}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "Confirm Reservation"
              )}
            </button>

            <p className="text-center text-black text-sm font-medium mt-4">
              Please note: For parties larger than 12, kindly call us directly.
            </p>
          </form>
        </div>
      </div>

      {/* --- Success/Error Pop-up Message --- */}
      {(successMessage || errorMessage) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePopup}
          ></div>
          <div
            className={`relative max-w-md w-full mx-4 p-6 rounded-xl shadow-2xl transform transition-all duration-300 scale-100 animate-slide-in-down
              ${
                successMessage
                  ? "bg-green-50 border-t-4 border-green-500"
                  : "bg-red-50 border-t-4 border-red-500"
              }
            `}
          >
            <div className="flex items-start">
              {successMessage ? (
                <CheckCircle className="h-7 w-7 text-green-600 mr-4 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-7 w-7 text-red-600 mr-4 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold ${
                    successMessage ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {successMessage ? "Reservation Confirmed!" : "Booking Error"}
                </h3>
                <p className="mt-1 text-base text-gray-700">
                  {successMessage || errorMessage}
                </p>
              </div>
              <button
                onClick={handleClosePopup}
                className={`ml-4 p-1 rounded-full ${
                  successMessage
                    ? "text-green-500 hover:bg-green-100"
                    : "text-red-500 hover:bg-red-100"
                } transition`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;