import dotenv from "dotenv";
import mongoose from "mongoose";
import { Admin } from "../models/index.js";

dotenv.config();

const seedInitialAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
    );
    console.log("Connected to database for seeding...");

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      // Create initial superadmin
      const initialAdmin = await Admin.create({
        email: process.env.INITIAL_ADMIN_EMAIL || "admin@example.com",
        password: process.env.INITIAL_ADMIN_PASSWORD || "admin123",
        role: "superadmin",
      });

      console.log("✅ Initial admin created successfully:");
      console.log(`   Email: ${initialAdmin.email}`);
      console.log(`   Role: ${initialAdmin.role}`);
      console.log(
        `   Password: ${process.env.INITIAL_ADMIN_PASSWORD || "admin123"}`
      );
      console.log("\n⚠️  IMPORTANT: Change the default password immediately!");
    } else {
      console.log(
        `✅ Database already has ${adminCount} admin(s). No seeding needed.`
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

// Run seeder
seedInitialAdmin();