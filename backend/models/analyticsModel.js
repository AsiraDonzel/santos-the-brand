import { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    visits: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for date-based queries
// analyticsSchema.index({ date: 1 });

// Pre-save hook to calculate conversion rate
analyticsSchema.pre("save", function (next) {
  if (this.visits > 0) {
    this.conversionRate = parseFloat(
      ((this.orders / this.visits) * 100).toFixed(2)
    );
  }
  next();
});

export default model("Analytics", analyticsSchema);
