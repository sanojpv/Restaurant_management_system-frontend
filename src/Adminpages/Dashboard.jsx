

import { useEffect, useState } from "react";
import { Loader2, ShoppingCart, Clock, Utensils, IndianRupee , Package, Calendar } from "lucide-react"; 
import api from "../services/api";
import { toast } from "react-toastify";

// component for the styled stat cards
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 ${color}`}>
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h4>
      <Icon className="text-white/80" size={24} />
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    
  </div>
);

//   component for status badges
const StatusBadge = ({ status }) => {
    const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full uppercase";
    
    switch (status?.toLowerCase()) { 
        case "confirmed":
            return <span className={`${baseStyle} bg-green-500/20 text-green-400 ring-1 ring-green-400/30`}>{status}</span>;
        case "pending":
            return <span className={`${baseStyle} bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-400/30`}>{status}</span>;
        case "cancelled":
            return <span className={`${baseStyle} bg-red-500/20 text-red-400 ring-1 ring-red-400/30`}>{status}</span>;
        default:
            return <span className={`${baseStyle} bg-gray-500/20 text-gray-400 ring-1 ring-gray-400/30`}>{status || 'Unknown'}</span>;
    }
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalMenuItems: 0,
    revenueToday: 0,
    revenueMonth: 0, 
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        // Ensure that res.data is an object before setting stats
        if (res.data) {
             setStats(res.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
        <p className="text-gray-400 ml-3">Loading metrics...</p>
      </div>
    );
  }

  // Use the admin's profile name from local storage or default
  const adminName = JSON.parse(localStorage.getItem('admin'))?.name?.split(' ')[0] || "Admin";

  return (
    <div className="p-0"> 
      <h1 className="text-3xl font-extrabold text-white mb-2">Dashboard Overview</h1>
      <p className="text-gray-400 mb-8">Hello {adminName}! Here's your restaurant's performance summary.</p>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value={(stats.totalOrders ?? 0).toLocaleString()} 
          icon={ShoppingCart}
          color="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
        />
        <StatCard
          title="Pending Orders"
          value={(stats.pendingOrders ?? 0).toLocaleString()}
          icon={Clock}
          color="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500"
        />
        <StatCard
          title="Menu Items"
          value={(stats.totalMenuItems ?? 0).toLocaleString()}
          icon={Utensils}
          color="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"
        />
        <StatCard
          title="Revenue Today"
          value={`₹${(stats.revenueToday ?? 0).toLocaleString()}`}
          icon={IndianRupee }
          color="bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500"
        />
        {/* Monthly Revenue Stat Card */}
        <StatCard
          title="Revenue This Month"
          value={`₹${(stats.revenueMonth ?? 0).toLocaleString()}`}
          icon={Calendar} 
          color="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500" 
        />
      </div>

      {/*  Recent Orders Table  */}
      <div className="bg-gray-800 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
        <h2 className="font-bold text-xl text-white mb-5 flex items-center gap-2">
            <Package size={20} className="text-orange-400" />
            Recent Orders ({stats.recentOrders?.length || 0})
        </h2>
        
        {/* Ensure stats.recentOrders is an array before checking length */}
        {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
            <div className="text-center p-10 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
                <p className="text-lg text-gray-400">No recent orders to display.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-emerald-700">
                    {/* Table Header */}
                    <thead className="bg-yellow-700">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider rounded-tl-lg">
                                Order ID
                            </th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider rounded-tr-lg">
                                Status
                            </th>
                        </tr>
                    </thead>
                    
                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-700">
                        {/*Check if stats.recentOrders is present before slicing/mapping */}
                        {stats.recentOrders.slice(0, 10).map((order) => (
                            <tr key={order._id} className="hover:bg-gray-700/30 transition duration-150">
                                <td className="p-3 text-sm font-mono text-gray-300">
                                    #{order._id.slice(-4)} 
                                </td>
                                <td className="p-3 text-sm text-white font-medium">
                                    {order.customerId?.name || "Unknown"}
                                </td>
                                <td className="p-3 text-sm text-green-400 font-semibold">
                                    ₹{order.totalAmount?.toFixed(2) || '0.00'}
                                </td>
                                <td className="p-3">
                                    <StatusBadge status={order.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;