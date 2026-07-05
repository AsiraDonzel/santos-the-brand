import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Order } from "../../../types";
import { useAllOrders, useUpdateOrder } from "@/hooks/adminHooks";
import Loader from "@/components/Loader";

const ORDER_STATUSES = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const statusColors: Record<string, string> = {
  processing: "text-amber-500",
  shipped: "text-blue-400",
  delivered: "text-green-400",
  cancelled: "text-red-500",
};

interface OrdersPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenOrderDetails: (order: Order) => void;
}

const OrdersPanel: React.FC<OrdersPanelProps> = ({
  searchQuery,
  onSearchChange,
  onOpenOrderDetails,
}) => {
  const orderQuery = useAllOrders();
  const updateOrder = useUpdateOrder();

  if (orderQuery.isLoading) return <Loader />;
  if (orderQuery.isError)
    return <div className="p-8 text-red-500">Error loading orders</div>;

  const orders: Order[] = orderQuery.data.orders || [];

  const filtered = orders?.filter((o: any) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.orderNumber || "").toLowerCase().includes(q) ||
      (o.customerName || "").toLowerCase().includes(q) ||
      (o.customerEmail || "").toLowerCase().includes(q)
    );
  });

  const handleUpdateOrderStatus = async (
    orderId: string,
    orderStatus: string,
  ) => {
    try {
     const response = await updateOrder.mutateAsync({
        orderId,
        orderData: { orderStatus },
      });
      if(response.status == 200){
        alert("Order status updated successfully");
      }
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      key="ord"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 bg-transparent"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-serif text-2xl text-primary-950">Orders</h2>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 shadow-sm rounded-sm text-sm outline-none focus:ring-1 focus:ring-primary-500 transition-shadow"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-sm">
          <p className="text-slate-400 font-serif">
            {searchQuery ? "No orders match your search" : "No orders yet"}
          </p>
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar-hide pb-4">
        <table className="w-[800px] lg:w-full text-left border-separate border-spacing-y-3">
          <thead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-2">Product Info</th>
              <th className="px-6 py-2">Customer</th>
              <th className="px-6 py-2">Order #</th>
              <th className="px-6 py-2">Total</th>
              <th className="px-6 py-2">Payment</th>
              <th className="px-6 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order: any) => (
              <tr
                key={order._id}
                onClick={() => onOpenOrderDetails(order)}
                className="bg-primary-950 text-white rounded-sm group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <td className="px-6 py-4 rounded-l-sm">
                  {order.items.length > 0 && (
                    <div className="flex items-center gap-3">
                      {order.items[0].image && (
                        <img
                          src={order.items[0].image}
                          alt={order.items[0].title || order.items[0].name}
                          className="w-10 h-10 object-cover rounded-sm border border-primary-800"
                        />
                      )}
                      <div className="max-w-[150px] lg:max-w-[200px]">
                        <p className="text-xs font-bold text-white truncate">
                          {(
                            order.items[0].title ||
                            order.items[0].name ||
                            ""
                          ).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-primary-400 mt-0.5">
                          {order.items.length > 1
                            ? `+${order.items.length - 1} more items`
                            : `x${order.items[0].quantity}`}
                        </p>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-medium text-white">
                    {order.customerName}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </td>
                <td className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-300">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-white">
                  ₦{(order.totalAmount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      order.paymentStatus === "completed"
                        ? "text-green-400"
                        : order.paymentStatus === "failed" ||
                            order.paymentStatus === "refunded"
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 rounded-r-sm">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleUpdateOrderStatus(order._id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className={`bg-transparent text-[10px] uppercase font-bold tracking-widest outline-none cursor-pointer appearance-none ${statusColors[order.orderStatus] || "text-slate-400"}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option
                        key={s}
                        value={s}
                        className={`bg-slate-900 ${statusColors[s]}`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdersPanel;
