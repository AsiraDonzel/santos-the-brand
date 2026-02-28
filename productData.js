//Product model

import { Schema, model } from "mongoose";

const variationSchema = new Schema({
  color: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  size: {
    type: String,
    trim: true,
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  price: {
    type: Number,
    min: 0,
  }, // Optional override price for this variation
  isActive: {
    type: Boolean,
    default: true,
  },
});

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    hoverImage: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    // Product variations
    hasVariations: {
      type: Boolean,
      default: false,
    },
    variations: [variationSchema],
    // Available options for filtering
    availableColors: [
      {
        name: String,
        code: String,
        image: String,
      },
    ],
    availableSizes: [
      {
        type: String,
      },
    ],
    // Global stock when no variations
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Product attributes
    attributes: {
      material: String,
      care: String,
      fit: String,
      length: String,
      occasion: String,
      season: String,
    },
    // Rating system
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // For soft delete
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ title: "text", description: "text" });

// Virtual for total stock (sum of variations or global stock)
productSchema.virtual("totalStock").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    return this.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return this.stock || 0;
});

// Virtual for minimum price
productSchema.virtual("minPrice").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    const prices = this.variations.map((v) => v.price || this.basePrice);
    return Math.min(...prices);
  }
  return this.basePrice;
});

// Virtual for maximum price
productSchema.virtual("maxPrice").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    const prices = this.variations.map((v) => v.price || this.basePrice);
    return Math.max(...prices);
  }
  return this.basePrice;
});

// Virtual for price range string
productSchema.virtual("priceRange").get(function () {
  if (this.hasVariations && this.variations.length > 0) {
    const min = this.minPrice;
    const max = this.maxPrice;
    if (min === max) {
      return `₦${min.toLocaleString()}`;
    }
    return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
  }
  return `₦${this.basePrice.toLocaleString()}`;
});

// Method to check if specific variation is in stock
productSchema.methods.checkVariationStock = function (
  color,
  size,
  quantity = 1,
) {
  if (!this.hasVariations || this.variations.length === 0) {
    return this.stock >= quantity;
  }

  const variation = this.variations.find(
    (v) => (!color || v.color?.name === color) && (!size || v.size === size),
  );

  if (!variation) return false;
  return variation.stock >= quantity;
};

// Method to get available variations
productSchema.methods.getAvailableVariations = function () {
  if (!this.hasVariations) {
    return {
      colors: [],
      sizes: [],
      hasBoth: false,
    };
  }

  const activeVariations = this.variations.filter(
    (v) => v.isActive && v.stock > 0,
  );

  // Extract unique colors and sizes with stock
  const colors = [
    ...new Set(
      activeVariations
        .filter((v) => v.color?.name)
        .map((v) => JSON.stringify(v.color)),
    ),
  ].map((c) => JSON.parse(c));

  const sizes = [
    ...new Set(activeVariations.filter((v) => v.size).map((v) => v.size)),
  ];

  return {
    colors,
    sizes,
    hasBoth: colors.length > 0 && sizes.length > 0,
    hasColors: colors.length > 0,
    hasSizes: sizes.length > 0,
  };
};

// Enable virtuals in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default model("Product", productSchema);


//product controller functions
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      basePrice,
      images,
      hoverImage,
      description,
      category,
      hasVariations = false,
      variations = [],
      stock = 0,
      attributes = {},
      tags = [],
      featured = false,
      trending = false,
      isActive = true,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !basePrice ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, base price, and at least one image are required.",
      });
    }

    if (basePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Base price must be greater than 0.",
      });
    }

    // Validate variations if product has them
    if (hasVariations) {
      if (!Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Variations are required when hasVariations is true.",
        });
      }

      // Extract unique colors and sizes for filtering
      const availableColors = [];
      const availableSizes = new Set();

      variations.forEach((v) => {
        if (v.color?.name) {
          const colorExists = availableColors.some(
            (c) => c.name === v.color.name,
          );
          if (!colorExists) {
            availableColors.push(v.color);
          }
        }
        if (v.size) {
          availableSizes.add(v.size);
        }
      });

      // Create product with variations
      const product = await Product.create({
        title,
        basePrice,
        images,
        hoverImage,
        description: description || "",
        category: category || "",
        hasVariations: true,
        variations: variations.map((v) => ({
          ...v,
          sku:
            v.sku ||
            `${title.substring(0, 3)}-${Date.now()}-${Math.random().toString(36).substring(7)}`.toUpperCase(),
        })),
        availableColors,
        availableSizes: Array.from(availableSizes),
        stock: 0, // Global stock is 0 when using variations
        attributes,
        tags,
        featured,
        trending,
        isActive,
      });

      return res.status(201).json({
        success: true,
        message: "Product with variations created successfully.",
        data: product,
      });
    }

    // Create product without variations
    const product = await Product.create({
      title,
      basePrice,
      images,
      hoverImage,
      description: description || "",
      category: category || "",
      hasVariations: false,
      stock,
      attributes,
      tags,
      featured,
      trending,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

// Update the updateProduct method to handle variations
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.rating;
    delete updateData.reviewCount;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Handle variations update
    if (updateData.variations) {
      updateData.hasVariations = true;

      // Regenerate available colors and sizes
      const availableColors = [];
      const availableSizes = new Set();

      updateData.variations.forEach((v) => {
        if (v.color?.name) {
          const colorExists = availableColors.some(
            (c) => c.name === v.color.name,
          );
          if (!colorExists) {
            availableColors.push(v.color);
          }
        }
        if (v.size) {
          availableSizes.add(v.size);
        }
      });

      updateData.availableColors = availableColors;
      updateData.availableSizes = Array.from(availableSizes);
    }

    // Validate price if provided
    if (updateData.basePrice && updateData.basePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Base price must be greater than 0.",
      });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};





