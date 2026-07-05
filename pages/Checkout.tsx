import React, { useState } from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, Mail, Ticket, Wallet, Package, Info, Plus, ChevronLeft, MapPin, ShieldCheck, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateOrder } from '@/hooks/orderHooks';

// Paystack brand badge component
const PaystackBadge = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <span
    className={`group inline-flex items-center gap-1.5 font-semibold transition-all duration-300 cursor-default select-none ${
      size === 'md' ? 'text-xs' : 'text-[10px]'
    }`}
    title="Payments secured by Paystack"
  >
    <span className="text-slate-400 font-normal tracking-wide group-hover:text-slate-500 transition-colors">
      Powered by
    </span>
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-transparent
        text-slate-500 group-hover:text-[#00C3F7] group-hover:border-[#00C3F7]/30
        group-hover:bg-[#00C3F7]/8 group-hover:shadow-[0_0_12px_rgba(0,195,247,0.25)]
        transition-all duration-300"
    >
      <ShieldCheck
        className="group-hover:text-[#00C3F7] transition-colors duration-300"
        style={{ width: size === 'md' ? 13 : 11, height: size === 'md' ? 13 : 11 }}
      />
      <span
        className="font-bold tracking-tight group-hover:text-[#00C3F7] transition-colors duration-300"
        style={{ fontSize: size === 'md' ? 12 : 10 }}
      >
        Paystack
      </span>
    </span>
  </span>
);

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  removeFromCart: (product: any, size: string, color: string) => void;
}

interface Address {
  id: string;
  type: "Home" | "Work";
  address: string;
  state: string;
  country: string;
  phone: string;
  city: string;
}

const steps = [
  { id: 1, label: "Cart Review" },
  { id: 2, label: "Delivery" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Complete" },
];

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart, removeFromCart }) => {
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  // 1 = Cart Review, 2 = Delivery, 3 = Payment (Order Review included before payment or together)
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer Data State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerState, setCustomerState] = useState("");

  // Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [selectedPickup, setSelectedPickup] = useState("afe-babalola");

  // Third Party Delivery State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New Address Form State
  const [newAddressType, setNewAddressType] = useState<"Home" | "Work">("Home");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newAddressState, setNewAddressState] = useState("");
  const [newAddressCountry, setNewAddressCountry] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("");
  const [newAddressPhone, setNewAddressPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<
    "paystack" | "delivery" | "transfer_on_delivery"
  >("paystack");

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Calculate dynamic shipping
  let shippingCost = 0;
  if (deliveryMethod === "pickup") {
    shippingCost = 10; // e.g. $10 or N4,000 equivalent
  } else if (deliveryMethod === "delivery" && selectedAddressId) {
    shippingCost = 25; // standard third party
  }

  const total = subtotal + shippingCost;

  const handleAddAddress = () => {
    if (
      !newAddressLine ||
      !newAddressState ||
      !newAddressCountry ||
      !newAddressCity ||
      !newAddressPhone
    )
      return;
    const newAddr: Address = {
      id: Date.now().toString(),
      type: newAddressType,
      address: newAddressLine,
      state: newAddressState,
      country: newAddressCountry,
      city: newAddressCity,
      phone: newAddressPhone,
    };
    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setIsAddingAddress(false);
    // Reset form
    setNewAddressLine("");
    setNewAddressState("");
    setNewAddressCountry("");
    setNewAddressPhone("");
    setNewAddressCity("")
  };

  const order = async (orderData: any) => {
    const response = await createOrder.mutateAsync(orderData);
    return response;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!customerName || !customerEmail || !customerPhone || !customerState) {
        alert(
          "Please completely fill out the Contact Information (Name, Email, Phone, State).",
        );
        return;
      }
      if (
        deliveryMethod === "delivery" &&
        !selectedAddressId &&
        addresses.length === 0
      ) {
        alert("Please add a delivery address.");
        return;
      }
      if (
        deliveryMethod === "delivery" &&
        !selectedAddressId &&
        addresses.length > 0
      ) {
        alert("Please select a delivery address.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setIsProcessing(true);

      // Clean up items mapping
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
        image: item.images?.[0] || "",
        variations: {
          color: item.selectedColor || "",
          size: item.selectedSize || "",
        },
      }));
      let shippingAddress = {
        street: "",
        city: "",
        state: "",
      }
      if (deliveryMethod === "pickup") {
        shippingAddress = {
          street: "Afe Babalola University, Ado-Ekiti",
          city: "Ado-Ekiti",
          state: "Ekiti",
        }

      } else if (deliveryMethod === "delivery") {
        const address = addresses.find((address) => address.id === selectedAddressId);
        shippingAddress = {
          street: address?.address || "",
          city: address?.city || "",
          state: address?.state || "",
        };
      }

      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        paymentMethod,
        promoCode: promoCode || "",
      };



      try {
        const response = await createOrder.mutateAsync(orderData);

        if (response.status === 201 || response.status === 200) {
          setIsProcessing(false);
          setCurrentStep(4);
          clearCart();
        }
      } catch (error: any) {
        setIsProcessing(false);
        console.error("Backend Validation Error:", error.response?.data);
        alert(
          error.response?.data?.message || "Order failed. Check your details.",
        );
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-primary-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-2xl shadow-xl max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl text-primary-950 mb-2">
            Order Confirmed
          </h2>
          <p className="text-slate-500 mb-8">
            Thank you for your purchase. A confirmation email has been sent to
            you.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary-950 text-white px-8 py-3 font-medium rounded hover:bg-primary-900 transition-colors tracking-widest uppercase text-xs"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 lg:pt-36 pb-12 overflow-x-hidden w-full">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar (Matching Reference) */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-3xl">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                        ? "bg-primary-900 text-white"
                        : "bg-gray-200 text-gray-400"
                      }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`absolute -bottom-6 text-[10px] w-24 text-center uppercase tracking-widest font-bold ${step.id <= currentStep
                      ? "text-primary-950"
                      : "text-gray-400"
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-grow h-[2px] mx-4 transition-colors ${step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* --- STEP 1: CART REVIEW --- */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 border-t-4 border-t-primary-950">
                  <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-primary-950">
                        <Package className="w-6 h-6 text-primary-600" /> Cart
                        Review
                      </h2>
                      <p className="text-sm text-slate-500 font-light mt-1">
                        Please review your order before proceeding.
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                        Total Items
                      </p>
                      <p className="font-bold text-primary-600">
                        {cart.length} items
                      </p>
                    </div>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      Your cart is currently empty.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {cart.map((item, i) => (
                        <div
                          key={`${item._id}-${i}`}
                          className="py-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative"
                        >
                          <div className="flex gap-4 sm:gap-6 items-center w-full sm:w-auto flex-grow">
                            <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-serif font-bold text-primary-950 truncate">
                                {item.title}
                              </h4>
                              <div className="flex gap-8 mt-2">
                                <div>
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                    Quantity
                                  </p>
                                  <p className="text-sm font-medium text-slate-700">
                                    {item.quantity}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                    Size
                                  </p>
                                  <p className="text-sm font-medium text-slate-700 uppercase">
                                    {item.selectedSize || "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex sm:flex-col items-end justify-between sm:h-full w-full sm:w-auto absolute sm:relative top-4 right-0 sm:top-auto sm:right-auto">
                            <div>
                              <p className="font-bold text-primary-950">
                                ₦{item.price.toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-400 line-through mt-1">
                                ₦{(item.price * 1.2).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item, item.selectedSize, item.selectedColor)}
                              className="text-slate-300 hover:text-red-500 transition-colors mt-4 p-1 rounded-full hover:bg-red-50"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={cart.length === 0}
                      className="w-full sm:w-auto bg-[#10b981] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]"
                    >
                      Proceed to Delivery
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- STEP 2: DELIVERY & CONTACT INFO --- */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 border-t-4 border-t-primary-950">
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-primary-950 mb-1">
                    <Mail className="w-6 h-6 text-primary-600" /> Contact
                    Information
                  </h2>
                  <p className="text-sm text-slate-500 mb-6 font-light">
                    Enter your details to receive order updates.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="State / Province"
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value)}
                      className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 border-t-4 border-t-primary-950">
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-primary-950 mb-1">
                    <Truck className="w-6 h-6 text-primary-600" /> Delivery
                    Information
                  </h2>
                  <p className="text-sm text-slate-500 mb-6 font-light">
                    Choose how you'd like to receive your order
                  </p>

                  {/* Method Selection */}
                  <div className="space-y-3 mb-8">
                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`w-full p-4 border rounded-sm flex items-center gap-4 transition-all text-left ${deliveryMethod === "pickup" ? "border-primary-600 bg-primary-50/50" : "border-gray-200 hover:border-primary-300"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryMethod === "pickup" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {deliveryMethod === "pickup" && (
                          <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-primary-950 font-bold text-sm uppercase tracking-wider">
                          <Package className="w-4 h-4 text-primary-600" />{" "}
                          Pickup Station
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Collect your order from one of our pickup locations
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`w-full p-4 border rounded-sm flex items-center gap-4 transition-all text-left ${deliveryMethod === "delivery" ? "border-primary-600 bg-primary-50/50" : "border-gray-200 hover:border-primary-300"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryMethod === "delivery" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {deliveryMethod === "delivery" && (
                          <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-primary-950 font-bold text-sm uppercase tracking-wider">
                          <Truck className="w-4 h-4 text-primary-600" /> Third
                          Party Delivery
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Direct delivery to your chosen address
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Contextual Sub-section */}
                  {deliveryMethod === "pickup" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <h3 className="text-sm font-bold text-primary-950 uppercase tracking-widest mb-4">
                        Select Pickup Station
                      </h3>
                      <button
                        onClick={() => {
                          (setSelectedPickup("afe-babalola"));
                        }}
                        className={`w-full p-4 border rounded-sm flex items-start gap-4 transition-all text-left ${selectedPickup === "afe-babalola" ? "border-primary-600 bg-primary-50/50" : "border-gray-200"}`}
                      >
                        <div
                          className={`w-4 h-4 mt-1 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPickup === "afe-babalola" ? "border-primary-600" : "border-gray-300"}`}
                        >
                          {selectedPickup === "afe-babalola" && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-primary-950 uppercase tracking-widest text-sm text-[13px]">
                              Afe Babalola University
                            </span>
                            <span className="font-bold text-primary-600 text-sm">
                              ₦10.00
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            Afe Babalola University, Ado-Ekiti, Ekiti state
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 ml-4.5 font-medium tracking-wide">
                            2ND and 4TH week Saturdays: 2PM-5PM
                          </p>
                        </div>
                      </button>
                    </div>
                  )}

                  {deliveryMethod === "delivery" && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm flex gap-3 mb-6">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm mb-1">
                            Third Party Delivery Service
                          </h4>
                          <p className="text-xs text-blue-800/80 leading-relaxed font-light">
                            SANTOS uses a leading third-party luxury dispatch
                            service to deliver products to your location safely.
                            The delivery fee depends on the destination.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-primary-950 uppercase tracking-widest">
                          Select Delivery Address
                        </h3>
                        {!isAddingAddress && (
                          <button
                            onClick={() => setIsAddingAddress(true)}
                            className="text-xs font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Address
                          </button>
                        )}
                      </div>

                      {/* Address List */}
                      {addresses.length > 0 && !isAddingAddress && (
                        <div className="space-y-3 mb-6">
                          {addresses.map((addr) => (
                            <button
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`w-full p-4 border rounded-sm flex items-start gap-4 transition-all text-left ${selectedAddressId === addr.id ? "border-primary-600 bg-primary-50/50" : "border-gray-200 hover:border-primary-300"}`}
                            >
                              <div
                                className={`w-4 h-4 mt-1 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id ? "border-primary-600" : "border-gray-300"}`}
                              >
                                {selectedAddressId === addr.id && (
                                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-primary-950 text-sm">
                                    {addr.type}
                                  </span>
                                  {selectedAddressId === addr.id && (
                                    <span className="bg-primary-100 text-primary-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600">
                                  {addr.address}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {addr.state}, {addr.country}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {addr.phone}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Add Address Form */}
                      {(isAddingAddress || addresses.length === 0) && (
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                          <h4 className="font-bold text-sm text-primary-950 mb-4 uppercase tracking-widest">
                            New Address Details
                          </h4>

                          <div className="flex gap-4 mb-4">
                            <button
                              onClick={() => setNewAddressType("Home")}
                              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm border ${newAddressType === "Home" ? "bg-primary-950 text-white border-primary-950" : "bg-white text-slate-600 border-gray-200"}`}
                            >
                              Home
                            </button>
                            <button
                              onClick={() => setNewAddressType("Work")}
                              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm border ${newAddressType === "Work" ? "bg-primary-950 text-white border-primary-950" : "bg-white text-slate-600 border-gray-200"}`}
                            >
                              Work
                            </button>
                          </div>

                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="Full Street Address"
                              value={newAddressLine}
                              onChange={(e) =>
                                setNewAddressLine(e.target.value)
                              }
                              className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                            />
                            <input
                              type="text"
                              placeholder="City"
                              value={newAddressCity}
                              onChange={(e) =>
                                setNewAddressCity(e.target.value)
                              }
                              className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="State / Province"
                                value={newAddressState}
                                onChange={(e) =>
                                  setNewAddressState(e.target.value)
                                }
                                className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                              />
                              <input
                                type="text"
                                placeholder="Country"
                                value={newAddressCountry}
                                onChange={(e) =>
                                  setNewAddressCountry(e.target.value)
                                }
                                className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                              />
                            </div>
                            <input
                              type="tel"
                              placeholder="Contact Phone Number"
                              value={newAddressPhone}
                              onChange={(e) =>
                                setNewAddressPhone(e.target.value)
                              }
                              className="p-3 border border-gray-200 rounded-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-full outline-none text-sm transition-colors"
                            />
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                              <button
                                onClick={handleAddAddress}
                                className="bg-primary-950 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-primary-800 transition-colors flex-grow"
                              >
                                Save Address
                              </button>
                              {addresses.length > 0 && (
                                <button
                                  onClick={() => setIsAddingAddress(false)}
                                  className="bg-white text-slate-600 border border-gray-200 px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col-reverse sm:flex-row gap-4">
                    <button
                      onClick={handleBack}
                      className="px-6 py-4 border border-gray-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Cart Review
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-grow bg-[#10b981] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Order Review Section inside Step 3 for compact layout */}
                <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 border-t-4 border-t-primary-950">
                  <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-primary-950">
                        <Package className="w-6 h-6 text-primary-600" /> Order
                        Review
                      </h2>
                      <p className="text-sm text-slate-500 font-light mt-1">
                        Please review your order before proceeding to payment.
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                        Order Summary
                      </p>
                      <p className="font-bold text-primary-600">
                        {cart.length} items
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cart.map((item, i) => (
                      <div
                        key={`${item.id}-${i}`}
                        className="py-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative"
                      >
                        <div className="flex gap-4 sm:gap-6 items-center w-full sm:w-auto flex-grow">
                          <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-serif font-bold text-primary-950 truncate">
                              {item.title}
                            </h4>
                            <div className="flex gap-8 mt-2">
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                  Quantity
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                  {item.quantity}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                  Size
                                </p>
                                <p className="text-sm font-medium text-slate-700 uppercase">
                                  {item.selectedSize || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right mt-2 sm:mt-0 w-full sm:w-auto border-t border-gray-50 pt-2 sm:border-0 sm:pt-0 flex justify-between sm:block">
                          <p className="font-bold text-primary-950">
                            ₦{item.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400 line-through mt-1">
                            ₦{(item.price * 1.2).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 border-t-4 border-t-primary-950">
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-primary-950 mb-1">
                    <Wallet className="w-6 h-6 text-primary-600" /> Payment
                  </h2>
                  <p className="text-sm text-slate-500 mb-6 font-light">
                    Choose your preferred payment method.
                  </p>

                  <div className="space-y-4">
                    {/* <button
                      onClick={() => setPaymentMethod('paystack')}
                      className={`w-full p-4 border rounded-sm flex flex-col items-start gap-2 transition-all ${
                        paymentMethod === 'paystack'
                          ? 'border-[#00C3F7]/60 bg-[#00C3F7]/5 shadow-[0_0_0_1px_rgba(0,195,247,0.2)]'
                          : 'border-gray-200 hover:border-[#00C3F7]/40 hover:bg-[#00C3F7]/3'
                      }`}
                    >
                      <div className="flex justify-between w-full items-center">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm uppercase tracking-wider text-primary-950">Pay now with Paystack</span>
                          <PaystackBadge size="sm" />
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                          paymentMethod === 'paystack' ? 'border-[#00C3F7]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'paystack' && <div className="w-2 h-2 bg-[#00C3F7] rounded-full" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 text-left">Secure payment via Card, Bank Transfer, or USSD.</p>
                      {paymentMethod === 'paystack' && (
                        <div className="mt-3 w-full bg-[#00C3F7]/8 border border-[#00C3F7]/20 p-3 rounded-sm text-xs text-slate-700 flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#00C3F7] flex-shrink-0 mt-0.5" />
                          <p>We do not store your card details. You will be redirected securely to Paystack to complete your transaction.</p>
                        </div>
                      )}
                    </button> */}

                    <button
                      onClick={() => setPaymentMethod("delivery")}
                      className={`w-full p-4 border rounded-sm flex flex-col items-start gap-2 transition-all ${paymentMethod === "delivery" ? "border-primary-600 bg-primary-50/50" : "border-gray-200 hover:border-primary-300"}`}
                    >
                      <div className="flex justify-between w-full items-center">
                        <span className="font-bold text-sm uppercase tracking-wider text-primary-950">
                          Pay with Cash on Delivery
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "delivery" ? "border-primary-600" : "border-gray-300"}`}
                        >
                          {paymentMethod === "delivery" && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 text-left">
                        Pay physically when the order is delivered.
                      </p>
                      {/* {paymentMethod === 'delivery' && (
                        <div className="mt-3 w-full bg-amber-50 border border-amber-100 p-3 rounded-sm text-xs text-amber-800 flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p>Please ensure you have the exact requested amount in cash on arrival. You MUST be present to receive the order.</p>
                        </div>
                      )} */}
                    </button>

                    {/* <button
                      onClick={() => setPaymentMethod('transfer_on_delivery')}
                      className={`w-full p-4 border rounded-sm flex flex-col items-start gap-2 transition-all ${paymentMethod === 'transfer_on_delivery' ? 'border-primary-600 bg-primary-50/50' : 'border-gray-200 hover:border-primary-300'}`}
                    >
                      <div className="flex justify-between w-full items-center">
                        <span className="font-bold text-sm uppercase tracking-wider text-primary-950">Transfer on Delivery</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer_on_delivery' ? 'border-primary-600' : 'border-gray-300'}`}>
                          {paymentMethod === 'transfer_on_delivery' && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 text-left">Transfer the amount to our delivery agent upon arrival.</p>
                      {paymentMethod === 'transfer_on_delivery' && (
                        <div className="mt-3 w-full bg-amber-50 border border-amber-100 p-3 rounded-sm text-xs text-amber-800 flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p>The delivery agent will provide the bank account details. Do not transfer to any account prior to seeing the product in person.</p>
                        </div>
                      )}
                    </button> */}
                  </div>

                  <div className="mt-8 flex flex-col-reverse sm:flex-row gap-4">
                    <button
                      onClick={handleBack}
                      disabled={isProcessing}
                      className="px-6 py-4 border border-gray-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Delivery
                    </button>
                    <div className="flex-grow flex flex-col gap-2">
                      <button
                        onClick={handleNext}
                        disabled={isProcessing}
                        className={`w-full text-white px-8 py-4 font-bold uppercase tracking-widest text-xs rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center ${
                          paymentMethod === 'paystack'
                            ? 'bg-[#00C3F7] hover:bg-[#0BA4DB] shadow-[0_4px_14px_0_rgba(0,195,247,0.4)] hover:shadow-[0_6px_20px_rgba(0,195,247,0.35)]'
                            : 'bg-[#10b981] hover:bg-[#059669] shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]'
                        }`}
                      >
                        {isProcessing ? 'Processing Transaction...' : `Pay ₦${total.toLocaleString()}`}
                      </button>
                      {paymentMethod === 'paystack' && (
                        <div className="flex justify-center">
                          <PaystackBadge size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-gray-100 sticky top-36">
              <h3 className="font-serif text-xl font-bold mb-6 text-primary-950">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  className="w-full bg-slate-50 border border-slate-200 p-4 pl-10 text-xs font-bold tracking-widest outline-none focus:border-primary-400 transition-colors uppercase"
                />
                <Ticket className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4 text-sm mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>
                    Delivery{" "}
                    <span className="text-[10px] text-primary-500 ml-1 block mt-0.5">
                      {deliveryMethod === "pickup"
                        ? "(Pickup)"
                        : "(Third Party)"}
                    </span>
                  </span>
                  <span className="font-medium text-slate-900">
                    {shippingCost === 0
                      ? "-"
                      : `₦${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-primary-950 font-bold text-xl pt-4 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-500 bg-blue-50/50 p-4 rounded-sm border border-blue-100/50">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  All transactions are secure and encrypted. We never store your
                  credit card details.
                </p>
              </div>

              <div className="mt-4 flex justify-center pt-4 border-t border-gray-100">
                <PaystackBadge size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Checkout;
