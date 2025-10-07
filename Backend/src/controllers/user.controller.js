import User from "../models/User.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /profile/:uid
export const getUserProfile = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) throw new ApiError(404, "User not found");

    return res
        .status(200)
        .json(new ApiResponse(200, { uid: user.uid, avatar: user.avatar }, "User profile fetched successfully"));
});


export const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const { avatar } = req.body;

    if (!avatar) throw new ApiError(400, "Avatar is required");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Update avatar
    user.avatar = avatar;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, { uid: user.uid, avatar: user.avatar }, "Profile updated successfully")
    );
});