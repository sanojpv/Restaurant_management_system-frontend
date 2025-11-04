import React, { useEffect, useState } from "react";
import api from "../services/api";
import { format } from "date-fns";
import { useNavigate } from "react-router";

const CustomerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.get("/reservation/customer/me");
      const data = res.data.reservations ?? res.data ?? [];
      setReservations(data);
      if (!data.length) setMsg("No reservations found.");
    } catch (err) {
      console.error("fetchReservations error:", err);
      setMsg(err.response?.data?.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    try {
      await api.delete(`/reservation/${id}`);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r))
      );
      alert("Reservation cancelled successfully!");
    } catch (err) {
      console.error("cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel reservation");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Status badge utility
  const getStatusBadge = (status) => {
    let cls;
    switch (status) {
      case "pending":
        cls = "text-amber-600 bg-amber-50";
        break;
      case "confirmed":
        cls = "text-teal-600 bg-teal-50";
        break;
      case "cancelled":
        cls = "text-red-600 bg-red-50";
        break;
      default:
        cls = "text-gray-600 bg-gray-100";
    }
    return (
      <span
        className={`font-semibold px-3 py-1 rounded-full text-xs capitalize whitespace-nowrap ${cls}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-6">
            My Reservations
          </h2>

          {loading ? (
            <div className="p-10 text-center text-emerald-600 font-medium">
              Loading reservations...
            </div>
          ) : msg ? (
            <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <p className="font-medium">{msg}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell w-1/4">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-auto">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {row.date
                              ? format(new Date(row.date), "MMM d, yyyy")
                              : "Date TBD"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {row.time || "Time TBD"} (
                            {row.partySize ?? row.guests ?? 1} people)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {row.table || "TBD"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row.status !== "cancelled" &&
                        row.status !== "completed" ? (
                          <button
                            onClick={() => handleCancel(row._id)}
                            className="px-4 py-1.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition text-sm shadow-md"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 inline-flex items-center justify-center bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition duration-150 shadow-lg text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerReservations;
