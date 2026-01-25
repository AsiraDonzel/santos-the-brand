import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    isWebsiteLocked: {
      type: Boolean,
      default: false,
    },
    lockMessage: {
      type: String,
      default: "We are currently updating our store. Please check back soon!",
    },
    lockImage: {
      type: String,
    },
    newsletterSubject: {
      type: String,
      default: "Newsletter Update",
    },
    newsletterTemplate: {
      type: String,
      default: "Dear subscriber, here are our latest updates!",
    },
    storeName: {
      type: String,
      default: "Clothing Store",
    },
    storeEmail: {
      type: String,
      default: "noreply@example.com",
    },
    contactPhone: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
    shippingPolicy: {
      type: String,
    },
    returnPolicy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default model("Settings", settingsSchema);
