import { useEffect, useState } from "react";
import api from "../api/axios";
import { Package, User, Calendar, DollarSign, ShoppingBag } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper for status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#e8e1d9] font-serif tracking-wide">
          Orders
        </h2>
        <p className="text-[#d0c5b2] mt-1">
          Manage all customer orders from your museum store.
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1c1510]/80 rounded-xl shadow-xl border border-[#e6c364]/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#d0c5b2]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-[#d0c5b2]">
            <Package size={40} className="mx-auto mb-4 opacity-50" />
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-white">
              <thead>
                <tr className="bg-[#2a221b] text-[#d0c5b2] uppercase text-sm">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-[#4d4637]/30 hover:bg-[#2a221b]/50 transition"
                  >
                    <td className="px-4 py-3 font-mono text-sm">
                      #{order._id?.slice(-6) || "N/A"}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <User size={16} className="text-[#e6c364]" />
                      {order.customerName || "Guest"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <ShoppingBag size={14} className="text-[#d0c5b2]" />
                        {order.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#e6c364]">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#d0c5b2] text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(order.createdAt)}
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
}