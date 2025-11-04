
import React, { useEffect, useState } from "react";
import { Search, Mail, User, Filter, Users } from "lucide-react";
import api from "../services/api";

const GetCustomers = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/customer");
        setCustomerList(response.data.customers || response.data || []);
        setError(null);
      } catch (error) {
        setError(error.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);

  const filteredCustomers = customerList.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading customers...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Customer Directory
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and view all your customers in one place
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header Row */}
          <div className="hidden sm:grid grid-cols-3 md:grid-cols-5 gap-4 bg-gray-100 px-4 sm:px-6 py-3 text-sm font-semibold text-gray-600">
            <span>Name</span>
            <span className="col-span-1 md:col-span-2">Email</span>
            <span className="hidden md:block">Phone</span>
           
          </div>

          {/* Customer Items */}
          <ul>
            {filteredCustomers.map((customer) => (
              <li
                key={customer._id}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-3 md:grid-cols-5 gap-4 items-center px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                      {customer.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 truncate">
                      {customer.name}
                    </span>
                  </div>

                  <span className="col-span-1 md:col-span-2 text-gray-600 truncate flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                    {customer.email}
                  </span>

                  <span className="hidden md:block text-gray-600 truncate">
                    {customer.phone || "-"}
                  </span>

                
                </div>

                {/* Mobile Layout */}
                <div className="sm:hidden p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      {customer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{customer.name}</p>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-400" />
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 text-sm">
                      {customer.phone || "-"}
                    </span>
                    <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100">
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-16">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">
              No customers found
            </h3>
            <p className="text-gray-500">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetCustomers;
