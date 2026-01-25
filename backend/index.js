import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import connectDB from "./config/database.js";
import errorHandler from "./middlewares/errorhandler.js";
import {websiteLockMiddleware} from "./middlewares/websiteLock.js";


import adminRoute from "./routes/adminRoute.js";
import productRoute from "./routes/productRoute.js";
import lockRoute from "./routes/lockRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import orderRoute from "./routes/orderRoute.js";
import newsletterRoute from "./routes/newsletterRoute.js";
import promoRoute from "./routes/promoRoute.js";


export const app = express();
const server = http.createServer(app);
dotenv.config();

const port = process.env.PORT || 4000; 


//middleware
app.use(apiLimiter);
app.use(express.json());
app.use(cors());


//api creation
app.get("/", (req, res) => {
  res.send("Express app is running");
});

connectDB();

app.use(websiteLockMiddleware)

// Routes
app.use('/admin', adminRoute);
app.use('/product', productRoute);
app.use('/lock', lockRoute);
app.use('/review', reviewRoute);
app.use('/order', orderRoute);
app.use('/newsletter', newsletterRoute);
app.use('/promo', promoRoute);

app.use(errorHandler);


server.listen(port, (error) => {
  if (!error) {
    console.log("server is running on port", port);
    console.log(`WebSocket ready on ws://localhost:${port}`);
  } else {
    console.log("Error :", error);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  app.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  app.close(() => process.exit(1));
});