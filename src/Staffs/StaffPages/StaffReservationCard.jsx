import React from "react";
import {
  Calendar,
  Users,
  Clock,
  User,
  Check,
  X,
  Phone,
  Loader2,
} from "lucide-react";

const ReservationCard = ({ reservation, onAccept, onDecline, isLoading }) => {
  //  Use reservation._id to determine button state
  const isAccepting =
    isLoading &&
    isLoading.id === reservation._id &&
    isLoading.action === "accept";
  const isDeclining =
    isLoading &&
    isLoading.id === reservation._id &&
    isLoading.action === "decline";

  const reservationDate = new Date(
    reservation.date || reservation.reservationTime
  ).toLocaleDateString();
  const reservationTime = new Date(
    reservation.date || reservation.reservationTime
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
      {/* Header / ID */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h3 className="text-xl font-bold text-emerald-700 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Reservation #{reservation._id.slice(-6)}
        </h3>
        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          PENDING
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-slate-700">
        <p className="flex items-center text-sm">
          <User className="w-4 h-4 mr-2 text-emerald-500" />
          Customer:{reservation.name}
        </p>
        <p className="flex items-center text-sm">
          <Users className="w-4 h-4 mr-2 text-emerald-500" />
          Party Size:{reservation.partySize}** Guests
        </p>
        <p className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-emerald-500" />
          Date & Time: {reservationDate} at {reservationTime}
        </p>
        <p className="flex items-center text-sm">
          <Phone className="w-4 h-4 mr-2 text-emerald-500" />
          Contact Email:{reservation.email || "N/A"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-5 pt-4 border-t border-slate-100">
        <button
          onClick={() => onAccept(reservation._id)}
          disabled={isAccepting || isDeclining}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition duration-150 disabled:bg-emerald-400 disabled:cursor-not-allowed shadow-md"
        >
          {isAccepting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {isAccepting ? "Confirming..." : "Accept Reservation"}
        </button>

        <button
          onClick={() => onDecline(reservation._id)}
          disabled={isAccepting || isDeclining}
          className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDeclining ? "..." : <X className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
