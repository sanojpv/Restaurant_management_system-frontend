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
  const isAccepting =
    isLoading &&
    isLoading.id === reservation._id &&
    isLoading.action === "accept";
  const isDeclining =
    isLoading &&
    isLoading.id === reservation._id &&
    isLoading.action === "decline";

  let dateTime = null;

  //  Date object
  if (
    reservation.reservationTime &&
    !isNaN(Date.parse(reservation.reservationTime))
  ) {
    dateTime = new Date(reservation.reservationTime);
  } else if (
    reservation.date &&
    reservation.time &&
    !isNaN(Date.parse(`${reservation.date}T${reservation.time}`))
  ) {
    dateTime = new Date(`${reservation.date}T${reservation.time}`);
  }

  // Format the date and time safely
  const reservationDate = dateTime
    ? `${String(dateTime.getDate()).padStart(2, "0")}/${String(
        dateTime.getMonth() + 1
      ).padStart(2, "0")}/${dateTime.getFullYear()}`
    : "N/A";

  const reservationTime = dateTime
    ? dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "N/A";

  return (
    <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h3 className="text-xl font-bold text-emerald-700 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Reservation #{reservation._id?.slice(-6) || "N/A"}
        </h3>
        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          PENDING
        </span>
      </div>

      <div className="space-y-2 text-slate-700">
        <p className="flex items-center text-sm sm:text-base">
          <User className="w-4 h-4 mr-2 text-emerald-500" />
          Customer:{" "}
          <span className="ml-1 font-medium">{reservation.name || "N/A"}</span>
        </p>

        <p className="flex items-center text-sm sm:text-base">
          <Users className="w-4 h-4 mr-2 text-emerald-500" />
          Party Size:
          <span className="ml-1 font-medium">
            {reservation.partySize || "N/A"} Guests
          </span>
        </p>

        <p className="flex items-center text-sm sm:text-base">
          <Clock className="w-4 h-4 mr-2 text-emerald-500" />
          Date & Time:
          <span className="ml-1 font-medium">
            {reservationDate} at {reservationTime}
          </span>
        </p>

        <p className="flex items-center text-sm sm:text-base">
          <Phone className="w-4 h-4 mr-2 text-emerald-500" />
          Contact Email:
          <span className="ml-1 font-medium">{reservation.email || "N/A"}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-slate-100">
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
          className="flex items-center justify-center flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDeclining ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <X className="w-4 h-4 mr-2" />
          )}
          {isDeclining ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
