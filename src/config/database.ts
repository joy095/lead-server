import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`, {
      host: conn.connection.host,
      name: conn.connection.name,
    });

    // Listen for connection events
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
  } catch (error: any) {
    logger.error("Error connecting to MongoDB", {
      error: error.message,
      stack: error.stack,
      uri: process.env.MONGODB_URI,
    });

    // Retry connection with exponential backoff
    setTimeout(() => {
      logger.info("Attempting to reconnect to MongoDB...");
      connectDB();
    }, 5000);

    // Don't exit process immediately, allow retries
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

export default connectDB;
