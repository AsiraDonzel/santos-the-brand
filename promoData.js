//Promo model
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


//create and edit controller
// @desc    Create promo code (Admin only)
// @route   POST /api/admin/promo
// @access  Private (Admin only)
export const createPromoCode = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType = 'percentage',
      discountValue,
      minPurchaseAmount = 0,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
      perUserLimit = 1,
      applicableCategories = [],
      excludedCategories = [],
      applicableProducts = [],
      excludedProducts = [],
      customerEmail,
      isSingleUse = false
    } = req.body;

    // Validate required fields
    if (!code || !discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Code and discount value are required.'
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Discount value must be greater than 0.'
      });
    }

    // Validate discount type specific rules
    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%.'
      });
    }

    // Check if code already exists
    const existingCode = await PromoCode.findOne({ 
      code: code.toUpperCase() 
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Promo code already exists.'
      });
    }

    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date.'
      });
    }

    // Create promo code
    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      usageLimit,
      perUserLimit,
      applicableCategories,
      excludedCategories,
      applicableProducts,
      excludedProducts,
      customerEmail: customerEmail ? customerEmail.toLowerCase() : null,
      isSingleUse,
      createdBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      message: 'Promo code created successfully.',
      data: promo
    });
  } catch (error) {
    console.error('Create promo code error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create promo code.'
    });
  }
};


// @desc    Update promo code (Admin only)
// @route   PUT /api/admin/promo/:id
// @access  Private (Admin only)
export const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.code;
    delete updateData.usedCount;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // If updating code, check for duplicates
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      const existingCode = await PromoCode.findOne({
        code: updateData.code,
        _id: { $ne: id }
      });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: 'Promo code already exists.'
        });
      }
    }

    const promo = await PromoCode.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code updated successfully.',
      data: promo
    });
  } catch (error) {
    console.error('Update promo code error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update promo code.'
    });
  }
};

// @desc    Toggle promo code status (Admin only)
// @route   PUT /api/admin/promo/:id/toggle
// @access  Private (Admin only)
export const togglePromoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value.'
      });
    }

    const promo = await PromoCode.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Promo code ${isActive ? 'activated' : 'deactivated'} successfully.`,
      data: promo
    });
  } catch (error) {
    console.error('Toggle promo status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code ID.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update promo code status.'
    });
  }
};