import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Index for active events within date range
eventSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
eventSchema.index({ priority: -1 });

// Virtual for checking if event is currently active
eventSchema.virtual("isCurrentlyActive").get(function () {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

export default model("Event", eventSchema);
