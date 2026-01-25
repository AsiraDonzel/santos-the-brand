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

export default model("Review", reviewSchema);
