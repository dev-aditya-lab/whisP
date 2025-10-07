import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

// Hash phone number securely
function hashPhoneNumber(phoneNumber) {
    const secret = process.env.PHONE_HASH_SECRET;
    if (!secret) {
        throw new Error("PHONE_HASH_SECRET is not set in environment variables");
    }
    return crypto
        .createHmac("sha256", secret)
        .update(phoneNumber)
        .digest("hex");
}

// Send OTP (temporary static for dev)
const sendOtp = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) throw new ApiError(400, "Phone number is required");

    // In real implementation, generate and send real OTP via Twilio/Firebase
    const otp = "6969";

    return res
        .status(200)
        .json(new ApiResponse(200, { otp }, "OTP sent successfully"));
});

// Register or Login User
const authUser = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber) throw new ApiError(400, "Phone number is required");
    if (!otp) throw new ApiError(400, "OTP is required");
    if (otp !== "6969") throw new ApiError(401, "Invalid OTP");

    const phoneHash = hashPhoneNumber(phoneNumber);
    let user = await User.findOne({ phoneHash });

    // If new user, register
    if (!user) {
        const uid = `U_${Date.now()}`;
        user = await User.create({
            phoneHash,
            uid,
            publicKey: "PLACEHOLDER_PUBLIC_KEY",
        });
    }

    const accessToken = generateAccessToken(user);

    // ✅ Set cookie-based session
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { id: user._id, uid: user.uid }, "Login successful")
        );
});

// Get Avatar (protected)
const getAvatar = asyncHandler(async (req, res) => {
    const avatar = req.body.avatar;
    if (!avatar) throw new ApiError(400, "Avatar is required");
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    user.avatar = avatar;
    await user.save();
    
    return res
        .status(200)
        .json(new ApiResponse(200, { avatar: user.avatar }, "Avatar retrieved"));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { sendOtp, authUser, getAvatar, logoutUser };
