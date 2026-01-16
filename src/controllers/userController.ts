import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

export const register = async (req: Request, res: Response): Promise<Response> => {
  logger.info("Hit register controller");

  try {
    const { name, email } = req.body;
    logger.info("User registration attempt", { email });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Registration failed: User already exists", { email });
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create user
    const user = new User(req.body);
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    logger.info("User registered successfully", { userId: user._id, email });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    logger.error("Error during user registration", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    logger.info("Hit login controller");
  
  try {
    const { email } = req.body;
    logger.info("User login attempt", { email });

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login failed: Invalid credentials", { email });
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      logger.warn("Login failed: Invalid credentials", { email });
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    logger.info("User logged in successfully", { userId: user._id, email });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    logger.error("Error during user login", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ success: false, message: error.message });
  }
};
