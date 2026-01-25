import { Schema, model } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    name: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ["website", "lock_page", "checkout", "manual", "import"],
      default: "website",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    lastEmailSent: {
      type: Date,
    },
    emailCount: {
      type: Number,
      default: 0,
    },
    openCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
// subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ subscribedAt: -1 });
subscriberSchema.index({ source: 1 });

// Static method to get subscriber stats
subscriberSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalSubscribers: { $sum: 1 },
        activeSubscribers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        inactiveSubscribers: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
        avgEmailsPerSubscriber: { $avg: '$emailCount' },
        totalEmailsSent: { $sum: '$emailCount' },
        totalOpens: { $sum: '$openCount' },
        totalClicks: { $sum: '$clickCount' }
      }
    }
  ]);

  return stats[0] || {
    totalSubscribers: 0,
    activeSubscribers: 0,
    inactiveSubscribers: 0,
    avgEmailsPerSubscriber: 0,
    totalEmailsSent: 0,
    totalOpens: 0,
    totalClicks: 0
  };
};


export default model("Subscriber", subscriberSchema);
