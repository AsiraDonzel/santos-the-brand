import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../models/index.js";


dotenv.config();

const sampleProducts = [
  {
    title: "Premium Cotton T-Shirt",
    price: 24.99,
    images: [
      "https://example.com/tshirt1.jpg",
      "https://example.com/tshirt2.jpg",
    ],
    description: "100% cotton premium t-shirt, comfortable and durable.",
    category: "T-Shirts",
    rating: 4.5,
    reviewCount: 120,
  },
  {
    title: "Classic Denim Jeans",
    price: 59.99,
    images: ["https://example.com/jeans1.jpg"],
    description: "Classic blue denim jeans with modern fit.",
    category: "Jeans",
    rating: 4.2,
    reviewCount: 85,
  },
  {
    title: "Summer Dress",
    price: 45.99,
    images: [
      "https://example.com/dress1.jpg",
      "https://example.com/dress2.jpg",
    ],
    description: "Light and breezy summer dress for warm days.",
    category: "Dresses",
    rating: 4.7,
    reviewCount: 65,
  },
  {
    title: "Winter Jacket",
    price: 89.99,
    images: ["https://example.com/jacket1.jpg"],
    description: "Warm and waterproof winter jacket.",
    category: "Jackets",
    rating: 4.4,
    reviewCount: 42,
  },
  {
    title: "Casual Sneakers",
    price: 65.99,
    images: ["https://example.com/sneakers1.jpg"],
    description: "Comfortable casual sneakers for everyday wear.",
    category: "Footwear",
    rating: 4.6,
    reviewCount: 210,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
    );
    console.log("Connected to database for seeding products...");

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log("Cleared existing products...");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${products.length} sample products successfully!`);

    // Show categories
    const categories = [...new Set(products.map((p) => p.category))];
    console.log("Available categories:", categories.join(", "));

    process.exit(0);
  } catch (error) {
    console.error("❌ Product seeding error:", error);
    process.exit(1);
  }
};

// Run seeder
seedProducts();