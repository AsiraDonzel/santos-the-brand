//order model
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
        variation: {
          color: String,
          size: String,
          sku: String,
        },
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
  },
);

// Indexes for better query performance
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default model("Order", orderSchema);

//order controller to update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, notes } = req.body;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid order status is required: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        $push: {
          statusHistory: {
            status: orderStatus,
            changedAt: new Date(),
            changedBy: req.admin.email,
            notes: notes || "",
          },
        },
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // TODO: Send status update email to customer

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};
