import mongoose from "mongoose";

const newsletterCampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      default: "default",
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "cancelled", "failed"],
      default: "draft",
    },
    scheduledFor: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    recipients: {
      type: String,
      enum: ["all", "active", "segment"],
      default: "all",
    },
    segmentCriteria: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    stats: {
      totalRecipients: { type: Number, default: 0 },
      sentCount: { type: Number, default: 0 },
      deliveredCount: { type: Number, default: 0 },
      openCount: { type: Number, default: 0 },
      clickCount: { type: Number, default: 0 },
      unsubscribeCount: { type: Number, default: 0 },
      bounceCount: { type: Number, default: 0 },
      spamCount: { type: Number, default: 0 },
    },
    previewText: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isTest: {
      type: Boolean,
      default: false,
    },
    testEmails: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes
newsletterCampaignSchema.index({ status: 1 });
newsletterCampaignSchema.index({ scheduledFor: 1 });
newsletterCampaignSchema.index({ sentAt: -1 });
newsletterCampaignSchema.index({ "stats.openCount": -1 });

// Virtual for open rate
newsletterCampaignSchema.virtual("openRate").get(function () {
  if (this.stats.sentCount === 0) return 0;
  return (this.stats.openCount / this.stats.sentCount) * 100;
});

// Virtual for click rate
newsletterCampaignSchema.virtual("clickRate").get(function () {
  if (this.stats.sentCount === 0) return 0;
  return (this.stats.clickCount / this.stats.sentCount) * 100;
});

// Enable virtuals in JSON
newsletterCampaignSchema.set("toJSON", { virtuals: true });
newsletterCampaignSchema.set("toObject", { virtuals: true });

const Newsletter = mongoose.model("Newsletter", newsletterCampaignSchema);
export default Newsletter;