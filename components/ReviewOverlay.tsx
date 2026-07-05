import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  Package,
  ArrowLeft,
  Loader2,
  Star,
} from "lucide-react";
import {
  useOrdersByEmail,
  useOrderDetails,
  useSubmitProductReview,
} from "../hooks/storeHooks";

interface ReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewOverlay: React.FC<ReviewOverlayProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // Flow steps: 'verify' -> 'orders' -> 'details' -> 'write'
  const [step, setStep] = useState<"verify" | "orders" | "details" | "write">(
    "verify",
  );

  // Selected states
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState(""); // Kept if you want to prepend to comment, or just ignore (backend takes comment)
  const [reviewText, setReviewText] = useState("");
  const [formError, setFormError] = useState("");

  // Queries
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    error: ordersError,
    refetch: fetchOrders,
  } = useOrdersByEmail(verifiedEmail);

  // Disable automatic fetching until we have an order selected
  const { data: orderDetailsData, isLoading: isOrderDetailsLoading } =
    useOrderDetails(selectedOrderId || "", verifiedEmail);

  const submitReviewMutation = useSubmitProductReview();

  // Reset completely when overlay opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        resetAll();
      }, 300);
    }
  }, [isOpen]);

  const resetAll = () => {
    setEmail("");
    setName("");
    setVerifiedEmail("");
    setStep("verify");
    setSelectedOrderId(null);
    setSelectedProduct(null);
    setRating(0);
    setReviewTitle("");
    setReviewText("");
    setFormError("");
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setFormError("Please provide both your name and email.");
      return;
    }
    setFormError("");
    setVerifiedEmail(email); // This triggers the useOrdersByEmail hook
    setStep("orders");
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setStep("details");
  };

  const handleSelectProductToReview = (item: any) => {
    // Find existing reviews check? (Handled by backend mostly)
    setSelectedProduct(item);
    setRating(0);
    setReviewTitle("");
    setReviewText("");
    setFormError("");
    setStep("write");
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      setFormError("Please select a star rating.");
      return;
    }
    if (!reviewText.trim()) {
      setFormError("Please write a review comment.");
      return;
    }
    if (!name.trim()) {
      setFormError("Your name is required.");
      return;
    }

    setFormError("");

    try {
      // Include headline in comment if provided
      const finalComment = reviewTitle
        ? `[${reviewTitle}] ${reviewText}`
        : reviewText;

      await submitReviewMutation.mutateAsync({
        productId: selectedProduct.productId._id || selectedProduct.productId, // accommodate populated or unpopulated
        reviewData: {
          customerName: name,
          rating,
          comment: finalComment,
        },
      });

      // Success
      alert("Your review has been successfully published! Thank you.");
      onClose();
    } catch (err: any) {
      setFormError(
        err.message ||
          "Failed to submit review. You may have already reviewed this product.",
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col pt-10 px-6 sm:px-12 md:px-24"
          >
            {/* Header */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-gray-100 pb-8 shrink-0">
              <span className="font-serif text-2xl text-primary-950">
                Client Feedback
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-slate-400 hover:text-black hover:rotate-90 transition-all duration-300"
              >
                <X className="w-8 h-8" strokeWidth={1} />
              </button>
            </div>

            {/* Content Area */}
            <div className="w-full max-w-4xl mx-auto py-12 flex-1 overflow-y-auto custom-scrollbar-hide">
              {/* STEP 1: VERIFY */}
              {step === "verify" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl mx-auto"
                >
                  <h2 className="text-3xl font-serif text-primary-950 mb-4">
                    Verify Your Identity
                  </h2>
                  <p className="text-slate-500 mb-8 leading-relaxed font-light">
                    To maintain the uncompromising standard of our feedback, we
                    strictly accept reviews from verified clients. Please enter
                    the details associated with your orders.
                  </p>

                  <form onSubmit={handleVerifyEmail} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-b-2 border-slate-200 outline-none focus:border-primary-600 py-3 text-lg bg-transparent transition-colors"
                        placeholder="e.g. Elena Santiago"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b-2 border-slate-200 outline-none focus:border-primary-600 py-3 text-lg bg-transparent transition-colors"
                        placeholder="e.g. elena@example.com"
                        required
                      />
                    </div>
                    {formError && (
                      <p className="text-red-500 text-sm mt-2">{formError}</p>
                    )}

                    <button
                      type="submit"
                      className="mt-8 px-10 py-5 bg-primary-950 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors w-full sm:w-auto shadow-xl shadow-primary-900/10"
                    >
                      Locate My Orders
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: ORDERS LIST */}
              {step === "orders" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={() => setStep("verify")}
                      className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-3xl font-serif text-primary-950">
                      Your Past Orders
                    </h2>
                  </div>
                  <p className="text-slate-500 mb-10 leading-relaxed font-light max-w-2xl">
                    Welcome, {name}. Please select an order from your history
                    below to view its items and write a verified review.
                  </p>

                  {isOrdersLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" />
                      <p className="text-sm uppercase tracking-widest font-bold">
                        Scanning secure records...
                      </p>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-red-50 border border-red-100 p-6 text-red-600 text-sm">
                      Failed to fetch your orders. Please try again later.
                    </div>
                  ) : ordersData?.data?.orders?.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-100 p-10 text-center text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <h3 className="font-serif text-xl mb-2 text-primary-950">
                        No Orders Found
                      </h3>
                      <p>
                        We couldn't locate any completed orders associated with{" "}
                        <strong className="text-black">{verifiedEmail}</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ordersData?.data?.orders?.map((order: any) => (
                        <div
                          key={order._id}
                          onClick={() =>
                            handleSelectOrder(order.orderNumber || order._id)
                          }
                          className="group border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary-100 group-hover:bg-primary-900 transition-colors duration-500" />

                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-1">
                                Order Tag
                              </div>
                              <h3 className="font-mono text-lg text-primary-950">
                                {order.orderNumber || order._id.substring(0, 8)}
                              </h3>
                            </div>
                            <div
                              className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${order.orderStatus === "delivered" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              {order.orderStatus}
                            </div>
                          </div>

                          <div className="space-y-2 mb-6 text-sm text-slate-500">
                            <p>
                              Date:{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p>Items: {order.items?.length || 0}</p>
                            <p>Total: ${order.totalAmount?.toLocaleString()}</p>
                          </div>

                          <button className="w-full border border-primary-900 text-primary-900 py-3 text-xs font-bold uppercase tracking-widest group-hover:bg-primary-900 group-hover:text-white transition-colors">
                            View Order
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: ORDER DETAILS (List of Products) */}
              {step === "details" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={() => setStep("orders")}
                      className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Orders
                    </button>
                    <h2 className="text-3xl font-serif text-primary-950">
                      Order {selectedOrderId}
                    </h2>
                  </div>

                  {isOrderDetailsLoading ? (
                    <div className="flex justify-center py-20 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : !orderDetailsData?.data ? (
                    <p className="text-red-500">
                      Could not load order details.
                    </p>
                  ) : (
                    <div>
                      <div className="bg-slate-50 p-6 mb-8 border border-slate-100">
                        <p className="text-sm text-slate-600 mb-2">
                          Select an item from this order to write a review.
                          Products from cancelled or heavily disputed orders may
                          not be eligible.
                        </p>
                        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-widest mt-4">
                          <CheckCircle className="w-3 h-3" /> Successfully
                          Authenticated
                        </div>
                      </div>

                      <div className="space-y-4">
                        {orderDetailsData.data.items?.map(
                          (item: any, idx: number) => {
                            // Determine the image, handling the populated "productId" object if available
                            const itemImage =
                              item.image || item.productId?.images?.[0] || "";
                            const itemTitle =
                              item.title ||
                              item.productId?.title ||
                              "Unknown Product";

                            return (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-slate-100 hover:border-primary-200 transition-colors bg-white"
                              >
                                {itemImage ? (
                                  <img
                                    src={itemImage}
                                    alt={itemTitle}
                                    className="w-20 h-24 object-cover object-top"
                                  />
                                ) : (
                                  <div className="w-20 h-24 bg-slate-100 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-slate-300" />
                                  </div>
                                )}

                                <div className="flex-1 text-center sm:text-left">
                                  <h4 className="font-serif text-lg text-primary-950">
                                    {itemTitle}
                                  </h4>
                                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                                    {item.variation?.color &&
                                      `Color: ${item.variation.color}`}
                                    {item.variation?.size &&
                                      ` | Size: ${item.variation.size}`}
                                  </p>
                                </div>

                                <button
                                  onClick={() =>
                                    handleSelectProductToReview(item)
                                  }
                                  className="w-full sm:w-auto px-8 py-3 bg-primary-50 text-primary-900 text-[10px] font-bold uppercase tracking-widest hover:bg-primary-900 hover:text-white transition-colors"
                                >
                                  Review Item
                                </button>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: WRITE REVIEW */}
              {step === "write" && selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={() => setStep("details")}
                      className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Line Items
                    </button>
                  </div>

                  <h2 className="text-3xl font-serif text-primary-950 mb-8">
                    Curate Your Review
                  </h2>

                  <div className="flex items-start gap-6 bg-slate-50 p-6 border border-slate-100 mb-10">
                    <img
                      src={
                        selectedProduct.image ||
                        selectedProduct.productId?.images?.[0]
                      }
                      alt=""
                      className="w-16 h-20 object-cover object-top"
                    />
                    <div>
                      <h3 className="font-serif text-lg text-primary-950">
                        {selectedProduct.title ||
                          selectedProduct.productId?.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Order #{selectedOrderId}
                      </p>
                      <div className="flex items-center mt-3 gap-1 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> Verified Purchase
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                        Overall Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-4xl transition-all duration-300 hover:scale-110 ${star <= rating ? "text-yellow-500 drop-shadow-sm" : "text-gray-200 hover:text-yellow-200"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Headline Summary
                      </label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full border-b border-gray-200 py-4 outline-none focus:border-primary-500 transition-colors text-xl font-serif"
                        placeholder="e.g. Exceptional Quality and Fit"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Detailed Feedback
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full border border-gray-200 p-5 min-h-[160px] outline-none focus:border-primary-900 transition-colors resize-y rounded-none bg-transparent"
                        placeholder="Tell us what you loved about it, how the materials feel, or anything else you'd like to share about your experience."
                      />
                    </div>

                    {formError && (
                      <div className="bg-red-50 text-red-600 p-4 text-sm border border-red-100 flex items-start gap-2">
                        <X className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{formError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleSubmitReview}
                      disabled={submitReviewMutation.isPending}
                      className="w-full md:w-auto px-12 bg-primary-950 text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors shadow-xl shadow-primary-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {submitReviewMutation.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {submitReviewMutation.isPending
                        ? "Publishing..."
                        : "Publish Review"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default ReviewOverlay;
