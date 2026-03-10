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

router.get("/order/", getOrders);
router.get("/:identifier", getOrder);

// @desc    Get all orders for a customer by email
// @route   GET /api/orders
// @access  Public (with email verification)
export const getOrders = async (req, res) => {
  try {
    const { email, page = 1, limit = 10 } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to view orders.",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ customerEmail: email.toLowerCase() })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("items.productId", "title images"),
      Order.countDocuments({ customerEmail: email.toLowerCase() }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          totalPages: Math.ceil(total / Number(limit)),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// @desc    Get order by ID or order number
// @route   GET /api/orders/:identifier
// @access  Public (with email verification)
export const getOrder = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to view order details.",
      });
    }

    // Find order by ID or order number
    const order = await Order.findOne({
      $or: [{ _id: identifier }, { orderNumber: identifier }],
      customerEmail: email.toLowerCase(),
    }).populate("items.productId", "title images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or email does not match.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order identifier.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
    });
  }
};


import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true, // You might want admin approval first
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for product reviews
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Middleware to update product rating when review is saved/deleted
reviewSchema.post("save", async function () {
  await updateProductRating(this.productId);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateProductRating(doc.productId);
  }
});

async function updateProductRating(productId) {
  const Review = mongoose.model("Review");
  const Product = mongoose.model("Product");

  const stats = await Review.aggregate([
    { $match: { productId: productId, isApproved: true } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(stats[0].averageRating.toFixed(1)),
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0,
    });
  }
}

// export default model("Review", reviewSchema);

router.post("/review/products/:productId/reviews", submitReview);


// @desc    Submit a review
// @route   POST /api/products/:productId/reviews
// @access  Public
export const submitReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { customerName, rating, comment } = req.body;

    // Validate input
    if (!customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and comment are required.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.'
      });
    }

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable.'
      });
    }

    // Check if customer has already reviewed this product
    // For guest reviews, we can check by name + product
    const existingReview = await Review.findOne({
      productId,
      customerName: customerName.trim()
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.'
      });
    }

    // Create review (initially approved for simplicity)
    // You might want to set isApproved: false for admin approval
    const review = await Review.create({
      productId,
      customerName: customerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true // Set to false if you want admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit review.'
    });
  }
};

