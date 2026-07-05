import React from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import { Order } from "../../../types";
import { useUpdateOrder } from "@/hooks/adminHooks";

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

const paymentStatusColors: Record<string, string> = {
  pending: "text-amber-400",
  completed: "text-green-400",
  failed: "text-red-400",
  refunded: "text-purple-400",
};

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
}) => {
  const updateOrder = useUpdateOrder();

  const handleUpdateStatus = async (orderStatus: string) => {
    if (!order) return;
    try {
      const response = await updateOrder.mutateAsync({
        orderId: order._id,
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
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVariationLabel = (variation?: {
    color?: string;
    size?: string;
    sku?: string;
  }) => {
    if (!variation) return null;
    const parts = [];
    if (variation.color) parts.push(variation.color);
    if (variation.size) parts.push(variation.size);
    return parts.length > 0 ? parts.join(" / ") : null;
  };

  return (
    <AnimatePresence>
      {order && (
        <Modal title={`Order: ${order.orderNumber}`} onClose={onClose}>
          <div className="p-0 md:p-8 bg-slate-900 min-h-full">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
              {/* Left Column: Items & Total */}
              <div className="flex-1 space-y-8">
                <div className="bg-[#172439] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
                  <div className="px-6 py-4 border-b border-slate-700/50 bg-[#1e2d48]">
                    <h3 className="font-bold text-xs text-slate-300 uppercase tracking-widest">
                      Purchased Items
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-700/50 max-h-[50vh] overflow-y-auto custom-scrollbar-hide">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-6 flex items-start gap-6 hover:bg-slate-800/30 transition-colors"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title || item.name}
                            className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-md shadow-md border border-slate-700"
                          />
                        )}
                        <div className="flex-1 flex flex-col justify-between self-stretch">
                          <div>
                            <p className="text-sm font-bold text-white leading-tight mb-1">
                              {item.title || item.name}
                            </p>
                            {getVariationLabel(item.variation) && (
                              <p className="text-xs text-slate-400">
                                {getVariationLabel(item.variation)}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Qty {item.quantity}
                            </p>
                            <p className="text-sm font-bold text-white">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Total */}
                <div className="bg-[#172439] rounded-xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
                    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">
                      Order Summary
                    </h3>
                    <p className="font-bold text-xs text-slate-400 uppercase tracking-widest">
                      Amount
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-300">
                      <p>Items ({order.items.length})</p>
                      <p>
                        ₦
                        {order.items
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0,
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                    {order.promoCode && (
                      <div className="flex justify-between text-sm text-green-400">
                        <p>Promo ({order.promoCode.code})</p>
                        <p>
                          -₦{order.promoCode.discountAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-red-400 pt-4 mt-2 border-t border-slate-700/50">
                      <p>Total:</p>
                      <p className="tracking-wide">
                        ₦{(order.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Status */}
              <div className="lg:w-[400px] xl:w-[450px] shrink-0 space-y-8">
                <div className="bg-[#172439] p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700/50 space-y-8">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-bold text-sm text-white mb-2">
                      Shipping Address
                    </h3>
                    <div className="text-sm text-slate-400 leading-relaxed font-light space-y-1">
                      <p>{order.shippingAddress?.street}</p>
                      <p>
                        {order.shippingAddress?.city}
                        {order.shippingAddress?.state
                          ? `, ${order.shippingAddress.state}`
                          : ""}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <p className="text-sm text-white font-medium">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {order.customerEmail}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-bold text-sm text-white mb-2">
                      Payment
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Method:</span>
                        <span className="text-white capitalize">
                          {order.paymentMethod === "delivery"
                            ? "Pay on Delivery"
                            : "Paystack"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status:</span>
                        <span
                          className={`font-bold uppercase text-xs tracking-widest ${paymentStatusColors[order.paymentStatus] || "text-slate-400"}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      {order.paystackReference && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Ref:</span>
                          <span className="text-slate-300 text-xs font-mono">
                            {order.paystackReference}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="pt-6 border-t border-slate-700/50">
                    <h3 className="font-bold text-sm text-white mb-2">
                      Order Date
                    </h3>
                    <p className="text-sm text-slate-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Order Status */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Order Status
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      disabled={updateOrder.isPending}
                      className="w-full mt-2 bg-slate-800/50 border border-slate-700 text-slate-300 text-sm px-4 py-3 rounded-md outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status History */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-3">
                        Status History
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar-hide">
                        {order.statusHistory.map((entry, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-800/30 rounded px-3 py-2 text-xs"
                          >
                            <div className="flex justify-between">
                              <span
                                className={`font-bold uppercase tracking-wider ${statusColors[entry.status] || "text-slate-300"}`}
                              >
                                {entry.status}
                              </span>
                              <span className="text-slate-500">
                                {formatDate(entry.changedAt)}
                              </span>
                            </div>
                            {entry.notes && (
                              <p className="text-slate-400 mt-1">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-2">
                        Notes
                      </h3>
                      <p className="text-sm text-slate-400">{order.notes}</p>
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-4 rounded-md transition-colors shadow-lg shadow-blue-900/20 mt-4"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailModal;
