import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    promoCode: {
      code: String,
      discountAmount: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["paystack", "delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    paystackReference: {
      type: String,
      sparse: true,
    },
    statusHistory: [
      {
        status: String,
        changedAt: Date,
        changedBy: String, // Admin email or system
        notes: String,
      },
    ],

    paymentLogs: [
      {
        type: String,
        data: Schema.Types.Mixed,
        timestamp: Date,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default model("Order", orderSchema);
