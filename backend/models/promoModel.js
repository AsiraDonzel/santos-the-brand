import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      default: "percentage",
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    perUserLimit: {
      type: Number,
      min: 1,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    excludedCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isSingleUse: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
// promoSchema.index({ code: 1 });
promoSchema.index({ isActive: 1 });
promoSchema.index({ startDate: 1, endDate: 1 });
promoSchema.index({ usedCount: 1 });
promoSchema.index({ customerEmail: 1 });

// Virtual for checking if promo is valid
promoSchema.virtual("isValid").get(function () {
  const now = new Date();

  if (!this.isActive) return false;
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;

  return true;
});

// Virtual for remaining uses
promoSchema.virtual("remainingUses").get(function () {
  if (!this.usageLimit) return Infinity;
  return Math.max(0, this.usageLimit - this.usedCount);
});

// Virtual for days remaining
promoSchema.virtual("daysRemaining").get(function () {
  if (!this.endDate) return Infinity;
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Enable virtuals in JSON
promoSchema.set("toJSON", { virtuals: true });
promoSchema.set("toObject", { virtuals: true });

// Pre-save hook to ensure code is uppercase
promoSchema.pre("save", function (next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// Method to validate and apply promo
promoSchema.methods.validateAndApply = function (
  orderAmount,
  items = [],
  customerEmail = null,
) {
  if (!this.isValid) {
    return { valid: false, error: "Promo code is not valid or has expired." };
  }

  // Check customer-specific promo
  if (this.customerEmail && this.customerEmail !== customerEmail) {
    return {
      valid: false,
      error: "This promo code is not valid for your account.",
    };
  }

  // Check minimum purchase
  if (orderAmount < this.minPurchaseAmount) {
    return {
      valid: false,
      error: `Minimum purchase amount of ₦${this.minPurchaseAmount} required.`,
    };
  }

  // Check category/product restrictions
  if (items.length > 0) {
    const applicableItems = items.filter((item) => {
      // Check if product is excluded
      if (
        this.excludedProducts &&
        this.excludedProducts.includes(item.productId)
      ) {
        return false;
      }

      // Check if category is excluded
      if (
        this.excludedCategories &&
        this.excludedCategories.includes(item.category)
      ) {
        return false;
      }

      // Check if specific products are required
      if (this.applicableProducts && this.applicableProducts.length > 0) {
        return this.applicableProducts.includes(item.productId);
      }

      // Check if specific categories are required
      if (this.applicableCategories && this.applicableCategories.length > 0) {
        return this.applicableCategories.includes(item.category);
      }

      return true;
    });

    if (applicableItems.length === 0) {
      return {
        valid: false,
        error: "Promo code not applicable to your cart items.",
      };
    }
  }

  // Calculate discount
  let discountAmount = 0;

  switch (this.discountType) {
    case "percentage":
      discountAmount = orderAmount * (this.discountValue / 100);
      if (this.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
      }
      break;

    case "fixed":
      discountAmount = Math.min(this.discountValue, orderAmount);
      break;

    case "free_shipping":
      discountAmount = 0; // You'll handle shipping separately
      break;
  }

  return {
    valid: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount: Math.round((orderAmount - discountAmount) * 100) / 100,
    type: this.discountType,
    value: this.discountValue,
  };
};

const Promo = mongoose.model("PromoCode", promoSchema);

export default Promo;
